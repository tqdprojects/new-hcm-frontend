import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../providers/SocketProvider';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import { attendanceService } from '../services/dynamicApi';
import { useDynamicData, useDynamicMutation } from './useDynamicData';

export function useRealTimeAttendance() {
  const { user, employee } = useAuthStore();
  const { socket, isConnected, emit, on, off } = useSocket();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const [currentStatus, setCurrentStatus] = useState<any>(null);

  // Get current attendance status
  const { data: statusResponse, refetch: refetchStatus } = useDynamicData({
    endpoint: '/attendance/status',
    queryKey: ['attendance-status', employee?._id],
    enabled: !!employee,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Real-time check-in mutation
  const checkInMutation = useDynamicMutation({
    endpoint: '/attendance/checkin',
    method: 'POST',
    invalidateQueries: [['attendance-status'], ['attendance-history']],
    onSuccess: (data, variables) => {
      emit('attendance:checkin', {
        employeeId: employee?._id,
        timestamp: new Date(),
        location: variables.location,
      });
      
      addNotification({
        title: 'Checked In Successfully',
        message: `Welcome! You checked in at ${new Date().toLocaleTimeString()}`,
        type: 'success'
      });
    }
  });

  // Real-time check-out mutation
  const checkOutMutation = useDynamicMutation({
    endpoint: '/attendance/checkout',
    method: 'POST',
    invalidateQueries: [['attendance-status'], ['attendance-history']],
    onSuccess: (data, variables) => {
      emit('attendance:checkout', {
        employeeId: employee?._id,
        timestamp: new Date(),
        totalHours: data.data.totalHours,
      });
      
      addNotification({
        title: 'Checked Out Successfully',
        message: `Good work! Total hours today: ${data.data.totalHours}h`,
        type: 'success'
      });
    }
  });

  // Set up real-time listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for attendance updates
    const handleAttendanceUpdate = (data: any) => {
      console.log('📍 Real-time attendance update:', data);
      
      // Update local status
      setCurrentStatus(data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['attendance-status'] });
      queryClient.invalidateQueries({ queryKey: ['team-attendance'] });
      
      // Show notification for team updates (managers/HR)
      if (['manager', 'hr', 'tenant-admin'].includes(user?.role || '')) {
        addNotification({
          title: 'Team Attendance Update',
          message: `${data.employeeName} ${data.action} at ${new Date(data.timestamp).toLocaleTimeString()}`,
          type: 'info'
        });
      }
    };

    const handleRegularizationUpdate = (data: any) => {
      console.log('📝 Regularization update:', data);
      
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      
      addNotification({
        title: 'Regularization Update',
        message: `Attendance regularization ${data.status}`,
        type: data.status === 'approved' ? 'success' : 'warning'
      });
    };

    const handleLocationAlert = (data: any) => {
      console.log('📍 Location alert:', data);
      
      addNotification({
        title: 'Location Alert',
        message: data.message,
        type: 'warning'
      });
    };

    // Subscribe to events
    on('attendance:update', handleAttendanceUpdate);
    on('attendance:regularization', handleRegularizationUpdate);
    on('attendance:location-alert', handleLocationAlert);

    return () => {
      off('attendance:update', handleAttendanceUpdate);
      off('attendance:regularization', handleRegularizationUpdate);
      off('attendance:location-alert', handleLocationAlert);
    };
  }, [socket, isConnected, user, employee, on, off, emit, queryClient, addNotification]);

  // Get user location for check-in/out
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  // Enhanced check-in with location and validation
  const checkIn = async (options: {
    captureLocation?: boolean;
    capturePhoto?: boolean;
    workFromHome?: boolean;
  } = {}) => {
    try {
      let location = null;
      
      if (options.captureLocation && !options.workFromHome) {
        try {
          const position = await getCurrentLocation();
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
        } catch (locationError) {
          console.warn('Location capture failed:', locationError);
          // Continue without location if user denies permission
        }
      }

      await checkInMutation.mutateAsync({
        location,
        workFromHome: options.workFromHome,
        device: navigator.userAgent,
        ipAddress: await getClientIP(),
      });
    } catch (error) {
      console.error('Check-in failed:', error);
      throw error;
    }
  };

  // Enhanced check-out
  const checkOut = async () => {
    try {
      let location = null;
      
      try {
        const position = await getCurrentLocation();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
      } catch (locationError) {
        console.warn('Location capture failed during checkout:', locationError);
      }

      await checkOutMutation.mutateAsync({
        location,
        device: navigator.userAgent,
      });
    } catch (error) {
      console.error('Check-out failed:', error);
      throw error;
    }
  };

  return {
    currentStatus: statusResponse?.data || currentStatus,
    isConnected,
    checkIn,
    checkOut,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    refetchStatus,
  };
}

// Helper function to get client IP
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Hook for team attendance monitoring (managers/HR)
export function useTeamAttendanceRealTime() {
  const { user } = useAuthStore();
  const { on, off, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);

  const canViewTeamAttendance = ['manager', 'hr', 'tenant-admin'].includes(user?.role || '');

  useEffect(() => {
    if (!canViewTeamAttendance || !isConnected) return;

    const handleTeamUpdate = (data: any) => {
      setLiveUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
      queryClient.invalidateQueries({ queryKey: ['team-attendance'] });
    };

    on('team:attendance-update', handleTeamUpdate);

    return () => {
      off('team:attendance-update', handleTeamUpdate);
    };
  }, [canViewTeamAttendance, isConnected, on, off, queryClient]);

  return {
    liveUpdates,
    isConnected,
    canViewTeamAttendance,
  };
}