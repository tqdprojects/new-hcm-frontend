import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    landmark?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contactDetails: {
    phone: string;
    email: string;
    fax?: string;
    website?: string;
  };
  headOfBranch?: string;
  departments: string[];
  timezone: string;
  currency: string;
  costCenter?: string;
  budgetAllocation?: number;
  operationalHours: {
    [key: string]: {
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    };
  };
  facilities?: Array<{
    name: string;
    type: string;
    capacity?: number;
    description?: string;
  }>;
  isActive: boolean;
  establishedDate?: Date;
  complianceCertifications?: string[];
  employeeCount?: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchEmployee {
  id: string;
  employeeId: string;
  branchId: string;
  assignedDate: Date;
  isActive: boolean;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
    joinDate: Date;
  };
}

export interface BranchAnalytics {
  totalBranches: number;
  activeBranches: number;
  branchTypes: Array<{
    type: string;
    count: number;
  }>;
  employeeDistribution: Array<{
    branchId: string;
    branchName: string;
    employeeCount: number;
  }>;
  geographicDistribution: Array<{
    country: string;
    state: string;
    count: number;
  }>;
  operationalMetrics: {
    averageEmployeesPerBranch: number;
    totalFacilities: number;
    branchesWithHeads: number;
  };
}

// Fetch all branches
export const useBranches = () => {
  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await apiClient.get('/branches');
      return response.data;
    },
  });
};

// Fetch single branch
export const useBranch = (branchId: string) => {
  return useQuery<Branch>({
    queryKey: ['branch', branchId],
    queryFn: async () => {
      const response = await apiClient.get(`/branches/${branchId}`);
      return response.data;
    },
    enabled: !!branchId,
  });
};

// Fetch branch employees
export const useBranchEmployees = (branchId: string) => {
  return useQuery<BranchEmployee[]>({
    queryKey: ['branch-employees', branchId],
    queryFn: async () => {
      const response = await apiClient.get(`/branches/${branchId}/employees`);
      return response.data;
    },
    enabled: !!branchId,
  });
};

// Fetch branch analytics
export const useBranchAnalytics = () => {
  return useQuery<BranchAnalytics>({
    queryKey: ['branch-analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/branches/analytics');
      return response.data;
    },
  });
};

// Create branch
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (branchData: Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/branches', branchData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch-analytics'] });
    },
  });
};

// Update branch
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...branchData }: Partial<Branch> & { id: string }) => {
      const response = await apiClient.put(`/branches/${id}`, branchData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['branch-analytics'] });
    },
  });
};

// Delete branch
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (branchId: string) => {
      const response = await apiClient.delete(`/branches/${branchId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch-analytics'] });
    },
  });
};

// Assign employee to branch
export const useAssignEmployeeToBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ branchId, employeeIds }: { branchId: string; employeeIds: string[] }) => {
      const response = await apiClient.post(`/branches/${branchId}/employees`, { employeeIds });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-employees', variables.branchId] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// Transfer employee between branches
export const useTransferEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      employeeId, 
      fromBranchId, 
      toBranchId, 
      transferDate 
    }: { 
      employeeId: string; 
      fromBranchId: string; 
      toBranchId: string; 
      transferDate?: Date;
    }) => {
      const response = await apiClient.post('/branches/transfer-employee', {
        employeeId,
        fromBranchId,
        toBranchId,
        transferDate,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-employees', variables.fromBranchId] });
      queryClient.invalidateQueries({ queryKey: ['branch-employees', variables.toBranchId] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// Bulk import branches
export const useBulkImportBranches = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (branches: Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>[]) => {
      const response = await apiClient.post('/branches/bulk-import', { branches });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch-analytics'] });
    },
  });
};

// Export branches
export const useExportBranches = () => {
  return useMutation({
    mutationFn: async (format: 'csv' | 'excel' | 'json' = 'csv') => {
      const response = await apiClient.get(`/branches/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

// Generate branch report
export const useGenerateBranchReport = () => {
  return useMutation({
    mutationFn: async (params: {
      dateRange?: { start: Date; end: Date };
      branchIds?: string[];
      includeEmployees?: boolean;
      includeFacilities?: boolean;
      includeAnalytics?: boolean;
    }) => {
      const response = await apiClient.post('/branches/generate-report', params, {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};