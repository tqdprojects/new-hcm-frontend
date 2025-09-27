import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../services/employeeApi';
import { IEmployee } from '../types';
import { useNotificationStore } from '../stores/notificationStore';

export const useEmployees = (params: any = {}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeApi.getEmployees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (employeeData: Partial<IEmployee>) => employeeApi.createEmployee(employeeData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification({
        title: 'Employee Created',
        message: `Employee ${data.data.personalDetails.firstName} ${data.data.personalDetails.lastName} has been created successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Error Creating Employee',
        message: error.response?.data?.error || 'Failed to create employee',
        type: 'error'
      });
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IEmployee> }) => 
      employeeApi.updateEmployee(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      addNotification({
        title: 'Employee Updated',
        message: 'Employee information has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Error Updating Employee',
        message: error.response?.data?.error || 'Failed to update employee',
        type: 'error'
      });
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification({
        title: 'Employee Deleted',
        message: 'Employee has been deleted successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Error Deleting Employee',
        message: error.response?.data?.error || 'Failed to delete employee',
        type: 'error'
      });
    }
  });
};

export const useOnboardingSteps = (id: string) => {
  return useQuery({
    queryKey: ['employee-onboarding', id],
    queryFn: () => employeeApi.getOnboardingSteps(id),
    enabled: !!id,
  });
};

export const useUpdateOnboardingStep = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, step, data }: { id: string; step: number; data: any }) => 
      employeeApi.updateOnboardingStep(id, step, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-onboarding', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      addNotification({
        title: 'Onboarding Updated',
        message: `Step ${variables.step} completed successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Error Updating Onboarding',
        message: error.response?.data?.error || 'Failed to update onboarding step',
        type: 'error'
      });
    }
  });
};