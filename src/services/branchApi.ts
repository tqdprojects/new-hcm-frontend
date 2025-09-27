import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';
import { IBranch } from '../types/branch';

interface BranchListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isActive?: boolean;
  country?: string;
  city?: string;
}

interface BranchCreateData {
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
  settings: any;
  operationalHours: any;
  facilities: any[];
  geofence?: any;
}

export const branchApi = {
  async getBranches(params: BranchListParams = {}): Promise<ApiResponse<{
    data: IBranch[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/branches', { params });
    return response.data;
  },

  async getBranchById(id: string): Promise<ApiResponse<IBranch>> {
    const response = await apiClient.get(`/branches/${id}`);
    return response.data;
  },

  async createBranch(data: BranchCreateData): Promise<ApiResponse<IBranch>> {
    const response = await apiClient.post('/branches', data);
    return response.data;
  },

  async updateBranch(id: string, data: Partial<BranchCreateData>): Promise<ApiResponse<IBranch>> {
    const response = await apiClient.put(`/branches/${id}`, data);
    return response.data;
  },

  async deleteBranch(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/branches/${id}`);
    return response.data;
  },

  async getBranchEmployees(branchId: string, params: any = {}): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`/branches/${branchId}/employees`, { params });
    return response.data;
  },

  async assignEmployeeToBranch(branchId: string, employeeId: string, data: {
    designation: string;
    department: string;
    joiningDate: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/branches/${branchId}/employees/${employeeId}`, data);
    return response.data;
  },

  async transferEmployee(fromBranchId: string, toBranchId: string, employeeId: string, data: {
    effectiveDate: string;
    reason: string;
    newDesignation?: string;
    newDepartment?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/branches/${fromBranchId}/transfer/${employeeId}`, {
      toBranchId,
      ...data
    });
    return response.data;
  },

  async getBranchAnalytics(branchId: string, period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/branches/${branchId}/analytics`, {
      params: { period }
    });
    return response.data;
  },

  async getBranchAttendance(branchId: string, date?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/branches/${branchId}/attendance`, {
      params: date ? { date } : {}
    });
    return response.data;
  },

  async updateBranchSettings(branchId: string, settings: any): Promise<ApiResponse<IBranch>> {
    const response = await apiClient.put(`/branches/${branchId}/settings`, settings);
    return response.data;
  },

  async getBranchTypes(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get('/branches/types');
    return response.data;
  },

  async getBranchFacilities(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get('/branches/facilities');
    return response.data;
  }
};