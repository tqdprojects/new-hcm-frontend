import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => {},
  off: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, accessToken, tenant } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !accessToken) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
        userId: user._id,
        tenantId: tenant?._id,
        role: user.role,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join tenant-specific room
      if (tenant?._id) {
        newSocket.emit('join:tenant', tenant._id);
      }
      
      // Join user-specific room
      newSocket.emit('join:user', user._id);
      
      // Join role-specific room
      newSocket.emit('join:role', user.role);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', error);
      setIsConnected(false);
    });

    // Real-time event handlers
    setupEventHandlers(newSocket, addNotification, queryClient);

    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user, accessToken, tenant]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }, [socket, isConnected]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  const joinRoom = useCallback((room: string) => {
    emit('join:room', room);
  }, [emit]);

  const leaveRoom = useCallback((room: string) => {
    emit('leave:room', room);
  }, [emit]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      emit, 
      on, 
      off, 
      joinRoom, 
      leaveRoom 
    }}>
      {children}
    </SocketContext.Provider>
  );
}

// Setup real-time event handlers
function setupEventHandlers(
  socket: Socket, 
  addNotification: any, 
  queryClient: any
) {
  // Attendance events
  socket.on('attendance:update', (data) => {
    console.log('📍 Attendance update:', data);
    queryClient.invalidateQueries({ queryKey: ['attendance-status'] });
    queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    queryClient.invalidateQueries({ queryKey: ['team-attendance'] });
    
    addNotification({
      title: 'Attendance Updated',
      message: `${data.employeeName} ${data.action} at ${new Date(data.timestamp).toLocaleTimeString()}`,
      type: 'info'
    });
  });

  // Leave events
  socket.on('leave:status-change', (data) => {
    console.log('🏖️ Leave status change:', data);
    queryClient.invalidateQueries({ queryKey: ['leaves'] });
    queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    
    addNotification({
      title: 'Leave Status Updated',
      message: `Leave request ${data.action}: ${data.leaveType} for ${data.days} days`,
      type: data.action === 'approved' ? 'success' : data.action === 'rejected' ? 'error' : 'info'
    });
  });

  // Performance events
  socket.on('goal:assigned', (data) => {
    console.log('🎯 Goal assigned:', data);
    queryClient.invalidateQueries({ queryKey: ['goals'] });
    
    addNotification({
      title: 'New Goal Assigned',
      message: `You have been assigned a new goal: ${data.goalTitle}`,
      type: 'info'
    });
  });

  socket.on('review:reminder', (data) => {
    console.log('📝 Review reminder:', data);
    addNotification({
      title: 'Review Reminder',
      message: `${data.reviewType} is due in ${data.daysRemaining} days`,
      type: 'warning'
    });
  });

  // Payroll events
  socket.on('payroll:processed', (data) => {
    console.log('💰 Payroll processed:', data);
    queryClient.invalidateQueries({ queryKey: ['payroll'] });
    
    addNotification({
      title: 'Payroll Processed',
      message: `Your salary for ${data.period} has been processed`,
      type: 'success'
    });
  });

  // Claims events
  socket.on('claim:status-change', (data) => {
    console.log('🧾 Claim status change:', data);
    queryClient.invalidateQueries({ queryKey: ['claims'] });
    
    addNotification({
      title: 'Claim Status Updated',
      message: `Your expense claim has been ${data.status}`,
      type: data.status === 'approved' ? 'success' : data.status === 'rejected' ? 'error' : 'info'
    });
  });

  // System notifications
  socket.on('system:notification', (data) => {
    console.log('🔔 System notification:', data);
    addNotification({
      title: data.title,
      message: data.message,
      type: data.type || 'info'
    });
  });

  // AI insights
  socket.on('ai:insight', (data) => {
    console.log('🤖 AI insight:', data);
    addNotification({
      title: 'AI Insight Available',
      message: data.insight,
      type: 'info'
    });
  });

  // Workflow events
  socket.on('workflow:action-required', (data) => {
    console.log('⚡ Workflow action required:', data);
    queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    
    addNotification({
      title: 'Action Required',
      message: `${data.workflowType} requires your approval`,
      type: 'warning'
    });
  });

  // Document events
  socket.on('document:generated', (data) => {
    console.log('📄 Document generated:', data);
    queryClient.invalidateQueries({ queryKey: ['generated-documents'] });
    
    addNotification({
      title: 'Document Ready',
      message: `${data.documentType} has been generated and is ready for download`,
      type: 'success'
    });
  });

  // Asset events
  socket.on('asset:assigned', (data) => {
    console.log('💻 Asset assigned:', data);
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    
    addNotification({
      title: 'Asset Assigned',
      message: `${data.assetName} has been assigned to you`,
      type: 'info'
    });
  });

  // Recruitment events
  socket.on('interview:scheduled', (data) => {
    console.log('📅 Interview scheduled:', data);
    queryClient.invalidateQueries({ queryKey: ['interviews'] });
    
    addNotification({
      title: 'Interview Scheduled',
      message: `Interview with ${data.candidateName} scheduled for ${new Date(data.scheduledAt).toLocaleDateString()}`,
      type: 'info'
    });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('🚨 Socket error:', error);
    addNotification({
      title: 'Connection Error',
      message: 'Real-time connection error. Some features may not work properly.',
      type: 'error'
    });
  });
}