import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '../services/leaveApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';
import { ILeave } from '../types';

export const useLeaves = (params: any = {}) => {
  return useQuery({
    queryKey: ['leaves', params],
    queryFn: () => leaveApi.getLeaves(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeave = (id: string) => {
  return useQuery({
    queryKey: ['leave', id],
    queryFn: () => leaveApi.getLeaveById(id),
    enabled: !!id,
  });
};

export const useLeaveTypes = () => {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.getLeaveTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLeaveBalance = (employeeId: string, year?: number) => {
  return useQuery({
    queryKey: ['leave-balance', employeeId, year],
    queryFn: () => leaveApi.getLeaveBalance(employeeId, year),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLeaveCalendar = (params: any = {}) => {
  return useQuery({
    queryKey: ['leave-calendar', params],
    queryFn: () => leaveApi.getLeaveCalendar(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => leaveApi.applyLeave(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      queryClient.invalidateQueries({ queryKey: ['leave-calendar'] });
      
      // Emit socket event for real-time updates
      emit('leave:applied', {
        leaveId: response.data._id,
        employeeId: response.data.employeeId,
        startDate: response.data.startDate,
        endDate: response.data.endDate,
        leaveType: response.data.leaveTypeId
      });

      addNotification({
        title: 'Leave Application Submitted',
        message: 'Your leave request has been submitted for approval',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Leave Application Failed',
        message: error.response?.data?.error || 'Failed to submit leave application',
        type: 'error'
      });
    }
  });
};

export const useUpdateLeave = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leaveApi.updateLeave(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leave-calendar'] });
      
      addNotification({
        title: 'Leave Updated',
        message: 'Your leave request has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Leave Update Failed',
        message: error.response?.data?.error || 'Failed to update leave request',
        type: 'error'
      });
    }
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      leaveApi.approveLeave(id, { comments }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      
      // Emit socket event for real-time updates
      emit('approval:action', {
        type: 'leave',
        resourceId: variables.id,
        action: 'approve',
        comments: variables.comments
      });

      addNotification({
        title: 'Leave Approved',
        message: 'Leave request has been approved successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Leave Approval Failed',
        message: error.response?.data?.error || 'Failed to approve leave request',
        type: 'error'
      });
    }
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      leaveApi.rejectLeave(id, { comments }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      
      // Emit socket event for real-time updates
      emit('approval:action', {
        type: 'leave',
        resourceId: variables.id,
        action: 'reject',
        comments: variables.comments
      });

      addNotification({
        title: 'Leave Rejected',
        message: 'Leave request has been rejected',
        type: 'info'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Leave Rejection Failed',
        message: error.response?.data?.error || 'Failed to reject leave request',
        type: 'error'
      });
    }
  });
};

export const useCancelLeave = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      leaveApi.cancelLeave(id, reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      
      addNotification({
        title: 'Leave Cancelled',
        message: 'Your leave request has been cancelled',
        type: 'info'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Leave Cancellation Failed',
        message: error.response?.data?.error || 'Failed to cancel leave request',
        type: 'error'
      });
    }
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => leaveApi.getPendingApprovals(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTeamLeaves = (managerId?: string) => {
  return useQuery({
    queryKey: ['team-leaves', managerId],
    queryFn: () => leaveApi.getTeamLeaves(managerId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};