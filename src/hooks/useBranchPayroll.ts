import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useNotificationStore } from '../stores/notificationStore';
import { IBranchPayroll, IBranchPayrollEmployee } from '../types/branch';
import { ApiResponse, PaginationInfo } from '../types/api';

interface BranchPayrollParams {
  branchId?: string;
  month?: number;
  year?: number;
  status?: string;
  page?: number;
  limit?: number;
}

interface ProcessBranchPayrollData {
  branchId: string;
  month: number;
  year: number;
  includeInactive?: boolean;
  customAdjustments?: Array<{
    employeeId: string;
    adjustments: Record<string, number>;
  }>;
}

// Get branch payroll records
export const useBranchPayrolls = (params: BranchPayrollParams = {}) => {
  return useQuery({
    queryKey: ['branch-payrolls', params],
    queryFn: async () => {
      const response = await apiClient.get('/payroll/branches', { params });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get specific branch payroll
export const useBranchPayroll = (branchId: string, month: number, year: number) => {
  return useQuery({
    queryKey: ['branch-payroll', branchId, month, year],
    queryFn: async () => {
      const response = await apiClient.get(`/payroll/branches/${branchId}`, {
        params: { month, year }
      });
      return response.data;
    },
    enabled: !!branchId && !!month && !!year,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get branch payroll summary
export const useBranchPayrollSummary = (branchId: string, period: string = '12m') => {
  return useQuery({
    queryKey: ['branch-payroll-summary', branchId, period],
    queryFn: async () => {
      const response = await apiClient.get(`/payroll/branches/${branchId}/summary`, {
        params: { period }
      });
      return response.data;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Process branch payroll
export const useProcessBranchPayroll = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (data: ProcessBranchPayrollData) => {
      const response = await apiClient.post('/payroll/branches/process', data);
      return response.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['branch-payroll', variables.branchId] });
      
      addNotification({
        title: 'Branch Payroll Processing Started',
        message: `Payroll processing initiated for ${response.data.employeeCount} employees`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Payroll Processing Failed',
        message: error.response?.data?.error || 'Failed to process branch payroll',
        type: 'error'
      });
    }
  });
};

// Approve branch payroll
export const useApproveBranchPayroll = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async ({ branchPayrollId, comments }: { branchPayrollId: string; comments?: string }) => {
      const response = await apiClient.put(`/payroll/branches/${branchPayrollId}/approve`, { comments });
      return response.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['branch-payroll'] });
      
      addNotification({
        title: 'Branch Payroll Approved',
        message: 'Branch payroll has been approved successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Approval Failed',
        message: error.response?.data?.error || 'Failed to approve branch payroll',
        type: 'error'
      });
    }
  });
};

// Generate branch payslips
export const useGenerateBranchPayslips = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async ({ branchPayrollId, sendEmail }: { branchPayrollId: string; sendEmail?: boolean }) => {
      const response = await apiClient.post(`/payroll/branches/${branchPayrollId}/payslips`, { sendEmail });
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['branch-payrolls'] });
      
      addNotification({
        title: 'Payslips Generated',
        message: `Generated ${response.data.count} payslips successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Payslip Generation Failed',
        message: error.response?.data?.error || 'Failed to generate payslips',
        type: 'error'
      });
    }
  });
};

// Get branch payroll analytics
export const useBranchPayrollAnalytics = (branchId: string, period: string = '12m') => {
  return useQuery({
    queryKey: ['branch-payroll-analytics', branchId, period],
    queryFn: async () => {
      const response = await apiClient.get(`/payroll/branches/${branchId}/analytics`, {
        params: { period }
      });
      return response.data;
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Compare branch payroll costs
export const useCompareBranchPayrolls = (branchIds: string[], period: string = '6m') => {
  return useQuery({
    queryKey: ['compare-branch-payrolls', branchIds, period],
    queryFn: async () => {
      const response = await apiClient.post('/payroll/branches/compare', {
        branchIds,
        period
      });
      return response.data;
    },
    enabled: branchIds.length > 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export branch payroll
export const useExportBranchPayroll = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async ({ branchPayrollId, format }: { branchPayrollId: string; format: 'excel' | 'pdf' | 'csv' }) => {
      const response = await apiClient.get(`/payroll/branches/${branchPayrollId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `branch-payroll-${variables.branchPayrollId}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      addNotification({
        title: 'Export Completed',
        message: 'Branch payroll report has been downloaded',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Export Failed',
        message: error.response?.data?.error || 'Failed to export branch payroll',
        type: 'error'
      });
    }
  });
};

// Get branch attendance summary
export const useBranchAttendanceSummary = (branchId: string, dateRange?: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ['branch-attendance-summary', branchId, dateRange],
    queryFn: async () => {
      const response = await apiClient.get(`/branches/${branchId}/attendance/summary`, {
        params: dateRange ? {
          startDate: dateRange.start.toISOString().split('T')[0],
          endDate: dateRange.end.toISOString().split('T')[0]
        } : {}
      });
      return response.data;
    },
    enabled: !!branchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get branch performance metrics
export const useBranchPerformance = (branchId: string, period: string = '6m') => {
  return useQuery({
    queryKey: ['branch-performance', branchId, period],
    queryFn: async () => {
      const response = await apiClient.get(`/branches/${branchId}/performance`, {
        params: { period }
      });
      return response.data;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};