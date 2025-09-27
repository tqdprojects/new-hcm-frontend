import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetApi } from '../services/timesheetApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

export const useTimesheets = (params: any = {}) => {
  return useQuery({
    queryKey: ['timesheets', params],
    queryFn: () => timesheetApi.getTimesheets(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTimesheet = (id: string) => {
  return useQuery({
    queryKey: ['timesheet', id],
    queryFn: () => timesheetApi.getTimesheetById(id),
    enabled: !!id,
  });
};

export const useProjects = (status?: string) => {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: () => timesheetApi.getProjects(status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClients = (isActive?: boolean) => {
  return useQuery({
    queryKey: ['clients', isActive],
    queryFn: () => timesheetApi.getClients(isActive),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => timesheetApi.getTasks(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) => 
      timesheetApi.createTimesheet(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      addNotification({
        title: 'Timesheet Created',
        message: 'New timesheet has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Timesheet Creation Failed',
        message: error.response?.data?.error || 'Failed to create timesheet',
        type: 'error'
      });
    }
  });
};

export const useAddTimesheetEntry = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ timesheetId, data }: { timesheetId: string; data: any }) => 
      timesheetApi.addTimesheetEntry(timesheetId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timesheet', variables.timesheetId] });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      addNotification({
        title: 'Entry Added',
        message: 'Timesheet entry has been added successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Entry Addition Failed',
        message: error.response?.data?.error || 'Failed to add timesheet entry',
        type: 'error'
      });
    }
  });
};

export const useSubmitTimesheet = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      timesheetApi.submitTimesheet(id, { comments }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timesheet', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      
      // Emit socket event for real-time updates
      emit('timesheet:submitted', {
        timesheetId: variables.id,
        employeeId: response.data.employeeId,
        totalHours: response.data.totalHours
      });

      addNotification({
        title: 'Timesheet Submitted',
        message: 'Your timesheet has been submitted for approval',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Timesheet Submission Failed',
        message: error.response?.data?.error || 'Failed to submit timesheet',
        type: 'error'
      });
    }
  });
};

export const useApproveTimesheet = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      timesheetApi.approveTimesheet(id, comments),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timesheet', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      
      // Emit socket event for real-time updates
      emit('approval:action', {
        type: 'timesheet',
        resourceId: variables.id,
        action: 'approve',
        comments: variables.comments
      });

      addNotification({
        title: 'Timesheet Approved',
        message: 'Timesheet has been approved successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Timesheet Approval Failed',
        message: error.response?.data?.error || 'Failed to approve timesheet',
        type: 'error'
      });
    }
  });
};

export const useRejectTimesheet = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) => 
      timesheetApi.rejectTimesheet(id, comments),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timesheet', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      
      // Emit socket event for real-time updates
      emit('approval:action', {
        type: 'timesheet',
        resourceId: variables.id,
        action: 'reject',
        comments: variables.comments
      });

      addNotification({
        title: 'Timesheet Rejected',
        message: 'Timesheet has been rejected',
        type: 'info'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Timesheet Rejection Failed',
        message: error.response?.data?.error || 'Failed to reject timesheet',
        type: 'error'
      });
    }
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => timesheetApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      addNotification({
        title: 'Project Created',
        message: 'New project has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Project Creation Failed',
        message: error.response?.data?.error || 'Failed to create project',
        type: 'error'
      });
    }
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => timesheetApi.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addNotification({
        title: 'Client Created',
        message: 'New client has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Client Creation Failed',
        message: error.response?.data?.error || 'Failed to create client',
        type: 'error'
      });
    }
  });
};