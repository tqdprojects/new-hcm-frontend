import { useEffect, useState } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { useNotificationStore } from '../stores/notificationStore';
import { useQueryClient } from '@tanstack/react-query';

interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
  timestamp: string;
  read: boolean;
  persistent?: boolean;
}

export function useRealTimeNotifications() {
  const { socket, isConnected, on, off, emit } = useSocket();
  const { addNotification, notifications } = useNotificationStore();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Subscribe to notification channels
    emit('notifications:subscribe', {
      channels: ['general', 'workflow', 'system', 'ai-insights']
    });
    setIsSubscribed(true);

    // Real-time notification handlers
    const handleNewNotification = (notification: RealTimeNotification) => {
      console.log('🔔 New real-time notification:', notification);
      
      addNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        actionUrl: notification.actionUrl,
      });

      // Play notification sound for urgent notifications
      if (notification.priority === 'urgent') {
        playNotificationSound();
      }

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    };

    const handleBulkNotifications = (notifications: RealTimeNotification[]) => {
      console.log('📬 Bulk notifications received:', notifications.length);
      
      notifications.forEach(notification => {
        addNotification({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          actionUrl: notification.actionUrl,
        });
      });
    };

    const handleNotificationRead = (data: { notificationId: string }) => {
      console.log('👁️ Notification marked as read:', data.notificationId);
      // Update local state if needed
    };

    const handleWorkflowNotification = (data: any) => {
      console.log('⚡ Workflow notification:', data);
      
      // Invalidate approval-related queries
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      
      addNotification({
        title: 'Approval Required',
        message: `${data.workflowType} requires your attention`,
        type: 'warning',
        actionUrl: data.actionUrl,
      });
    };

    const handleSystemAlert = (data: any) => {
      console.log('🚨 System alert:', data);
      
      addNotification({
        title: 'System Alert',
        message: data.message,
        type: data.severity === 'critical' ? 'error' : 'warning',
      });
    };

    const handleAIInsight = (data: any) => {
      console.log('🤖 AI insight notification:', data);
      
      addNotification({
        title: 'AI Insight Available',
        message: data.insight,
        type: 'info',
        actionUrl: '/ai',
      });
    };

    // Subscribe to events
    on('notification:new', handleNewNotification);
    on('notification:bulk', handleBulkNotifications);
    on('notification:read', handleNotificationRead);
    on('workflow:notification', handleWorkflowNotification);
    on('system:alert', handleSystemAlert);
    on('ai:insight-notification', handleAIInsight);

    return () => {
      // Unsubscribe from events
      off('notification:new', handleNewNotification);
      off('notification:bulk', handleBulkNotifications);
      off('notification:read', handleNotificationRead);
      off('workflow:notification', handleWorkflowNotification);
      off('system:alert', handleSystemAlert);
      off('ai:insight-notification', handleAIInsight);
      
      // Unsubscribe from channels
      emit('notifications:unsubscribe');
      setIsSubscribed(false);
    };
  }, [socket, isConnected, on, off, emit, addNotification, queryClient]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    emit('notification:mark-read', { notificationId });
  };

  // Mark all as read
  const markAllAsRead = () => {
    emit('notification:mark-all-read');
  };

  return {
    isConnected,
    isSubscribed,
    unreadCount,
    requestNotificationPermission,
    markAsRead,
    markAllAsRead,
  };
}

// Play notification sound
function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(console.warn);
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
}

// Hook for real-time approval workflows
export function useRealTimeApprovals() {
  const { user } = useAuthStore();
  const { on, off, emit, isConnected } = useSocket();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  const canApprove = ['manager', 'hr', 'finance', 'tenant-admin'].includes(user?.role || '');

  useEffect(() => {
    if (!canApprove || !isConnected) return;

    const handleNewApproval = (data: any) => {
      console.log('📋 New approval required:', data);
      
      setPendingApprovals(prev => [data, ...prev]);
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      
      addNotification({
        title: 'New Approval Required',
        message: `${data.type} from ${data.submittedBy} requires your approval`,
        type: 'warning',
        actionUrl: data.actionUrl,
      });
    };

    const handleApprovalProcessed = (data: any) => {
      console.log('✅ Approval processed:', data);
      
      setPendingApprovals(prev => prev.filter(approval => approval.id !== data.approvalId));
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    };

    const handleEscalation = (data: any) => {
      console.log('⏰ Approval escalated:', data);
      
      addNotification({
        title: 'Approval Escalated',
        message: `${data.type} has been escalated due to SLA breach`,
        type: 'error',
        actionUrl: data.actionUrl,
      });
    };

    on('approval:new', handleNewApproval);
    on('approval:processed', handleApprovalProcessed);
    on('approval:escalated', handleEscalation);

    return () => {
      off('approval:new', handleNewApproval);
      off('approval:processed', handleApprovalProcessed);
      off('approval:escalated', handleEscalation);
    };
  }, [canApprove, isConnected, on, off, user, addNotification, queryClient]);

  const processApproval = (approvalId: string, action: 'approve' | 'reject', comments?: string) => {
    emit('approval:process', {
      approvalId,
      action,
      comments,
      processedBy: user?._id,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    pendingApprovals,
    isConnected,
    canApprove,
    processApproval,
  };
}

// Hook for real-time system monitoring
export function useRealTimeSystemMonitoring() {
  const { user } = useAuthStore();
  const { on, off, isConnected } = useSocket();
  const { addNotification } = useNotificationStore();
  const [systemMetrics, setSystemMetrics] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  const canMonitorSystem = ['super-admin', 'tenant-admin'].includes(user?.role || '');

  useEffect(() => {
    if (!canMonitorSystem || !isConnected) return;

    const handleSystemMetrics = (data: any) => {
      console.log('📊 System metrics update:', data);
      setSystemMetrics(data);
    };

    const handleSystemAlert = (data: any) => {
      console.log('🚨 System alert:', data);
      
      setAlerts(prev => [data, ...prev.slice(0, 19)]); // Keep last 20 alerts
      
      addNotification({
        title: 'System Alert',
        message: data.message,
        type: data.severity === 'critical' ? 'error' : 'warning',
      });
    };

    const handlePerformanceAlert = (data: any) => {
      console.log('⚡ Performance alert:', data);
      
      if (data.severity === 'critical') {
        addNotification({
          title: 'Performance Alert',
          message: `${data.metric} is ${data.value} (threshold: ${data.threshold})`,
          type: 'error',
        });
      }
    };

    on('system:metrics', handleSystemMetrics);
    on('system:alert', handleSystemAlert);
    on('system:performance-alert', handlePerformanceAlert);

    return () => {
      off('system:metrics', handleSystemMetrics);
      off('system:alert', handleSystemAlert);
      off('system:performance-alert', handlePerformanceAlert);
    };
  }, [canMonitorSystem, isConnected, on, off, addNotification]);

  return {
    systemMetrics,
    alerts,
    isConnected,
    canMonitorSystem,
  };
}