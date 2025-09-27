// src/hooks/usePayroll.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from '../services/payrollApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

// =============================
// Payroll Summary & Trends Hooks
// =============================
export const usePayrollSummary = (params: { branchId?: string }) => {
  return useQuery({
    queryKey: ['payroll-summary', params],
    queryFn: () => payrollApi.getPayrollSummary(params),
    enabled: !!params.branchId, // only fetch if branch is set
    staleTime: 5 * 60 * 1000,
  });
};

export const usePayrollTrends = (period: string, branchId?: string) => {
  return useQuery({
    queryKey: ['payroll-trends', { period, branchId }],
    queryFn: () => payrollApi.getPayrollTrends({ period, branchId }),
    enabled: !!branchId, // only fetch if branch is set
    staleTime: 5 * 60 * 1000,
  });
};

// =============================
// Salary Components Hooks
// =============================
export const useSalaryComponents = (params: any = {}) => {
  return useQuery({
    queryKey: ['salary-components', params],
    queryFn: () => payrollApi.getSalaryComponents(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalaryComponent = (id: string) => {
  return useQuery({
    queryKey: ['salary-component', id],
    queryFn: () => payrollApi.getSalaryComponentById(id),
    enabled: !!id,
  });
};

export const useCreateSalaryComponent = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => payrollApi.createSalaryComponent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });

      emit('payroll:component-created', {
        componentId: response.data._id,
        name: response.data.name,
        type: response.data.type,
      });

      addNotification({
        title: 'Component Created',
        message: `Salary component "${response.data.name}" has been created successfully`,
        type: 'success',
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Creation Failed',
        message: error.response?.data?.error || 'Failed to create salary component',
        type: 'error',
      });
    },
  });
};

export const useUpdateSalaryComponent = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      payrollApi.updateSalaryComponent(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
      queryClient.invalidateQueries({ queryKey: ['salary-component', variables.id] });

      addNotification({
        title: 'Component Updated',
        message: 'Salary component has been updated successfully',
        type: 'success',
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Update Failed',
        message: error.response?.data?.error || 'Failed to update salary component',
        type: 'error',
      });
    },
  });
};

// =============================
// Salary Structures Hooks
// =============================
export const useSalaryStructures = (params: any = {}) => {
  return useQuery({
    queryKey: ['salary-structures', params],
    queryFn: () => payrollApi.getSalaryStructures(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalaryStructure = (id: string) => {
  return useQuery({
    queryKey: ['salary-structure', id],
    queryFn: () => payrollApi.getSalaryStructureById(id),
    enabled: !!id,
  });
};

export const useCreateSalaryStructure = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => payrollApi.createSalaryStructure(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['salary-structures'] });

      addNotification({
        title: 'Structure Created',
        message: `Salary structure "${response.data.name}" has been created successfully`,
        type: 'success',
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Creation Failed',
        message: error.response?.data?.error || 'Failed to create salary structure',
        type: 'error',
      });
    },
  });
};

// =============================
// Employee Salary Hooks
// =============================
export const useEmployeeSalary = (employeeId: string) => {
  return useQuery({
    queryKey: ['employee-salary', employeeId],
    queryFn: () => payrollApi.getEmployeeSalary(employeeId),
    enabled: !!employeeId,
  });
};

export const useSetEmployeeSalary = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: any }) =>
      payrollApi.setEmployeeSalary(employeeId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-salary', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });

      emit('salary:updated', {
        employeeId: variables.employeeId,
        grossSalary: response.data.grossSalary,
        effectiveDate: response.data.effectiveDate,
      });

      addNotification({
        title: 'Salary Updated',
        message: 'Employee salary has been set successfully',
        type: 'success',
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Salary Update Failed',
        message: error.response?.data?.error || 'Failed to update employee salary',
        type: 'error',
      });
    },
  });
};

// =============================
// Miscellaneous Hooks
// =============================
export const useComponentCategories = () => {
  return useQuery({
    queryKey: ['component-categories'],
    queryFn: () => payrollApi.getComponentCategories(),
    staleTime: 10 * 60 * 1000,
  });
};

export const usePreviewPayroll = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ structureId, overrides }: { structureId: string; overrides?: any }) =>
      payrollApi.previewPayroll(structureId, overrides),
    onError: (error: any) => {
      addNotification({
        title: 'Preview Failed',
        message: error.response?.data?.error || 'Failed to generate payroll preview',
        type: 'error',
      });
    },
  });
};
