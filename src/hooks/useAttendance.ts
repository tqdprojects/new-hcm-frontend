import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../services/attendanceApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

export const useAttendanceStatus = () => {
  return useQuery({
    queryKey: ['attendance-status'],
    queryFn: () => attendanceApi.getCurrentStatus(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useAttendanceHistory = (params: any = {}) => {
  return useQuery({
    queryKey: ['attendance-history', params],
    queryFn: () => attendanceApi.getAttendanceHistory(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => attendanceApi.checkIn(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-status'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      
      // Emit socket event for real-time updates
      emit('attendance:checkin', {
        timestamp: new Date(),
        ...response.data
      });

      addNotification({
        title: 'Checked In Successfully',
        message: `You have been checked in at ${new Date().toLocaleTimeString()}`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Check-in Failed',
        message: error.response?.data?.error || 'Failed to check in',
        type: 'error'
      });
    }
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => attendanceApi.checkOut(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-status'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      
      // Emit socket event for real-time updates
      emit('attendance:checkout', {
        timestamp: new Date(),
        ...response.data
      });

      addNotification({
        title: 'Checked Out Successfully',
        message: `You have been checked out at ${new Date().toLocaleTimeString()}. Total hours: ${response.data.totalHours}`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Check-out Failed',
        message: error.response?.data?.error || 'Failed to check out',
        type: 'error'
      });
    }
  });
};

export const useRequestRegularization = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => attendanceApi.requestRegularization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      addNotification({
        title: 'Regularization Requested',
        message: 'Your attendance regularization request has been submitted for approval',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Regularization Failed',
        message: error.response?.data?.error || 'Failed to submit regularization request',
        type: 'error'
      });
    }
  });
};

export const useTeamAttendance = (date?: string) => {
  return useQuery({
    queryKey: ['team-attendance', date],
    queryFn: () => attendanceApi.getTeamAttendance(date),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};