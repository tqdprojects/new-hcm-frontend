import { apiClient } from './apiClient';
import { IEmployee } from '../types';
import { IApiResponse, IPagination } from '../types/api';

interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
}

interface EmployeeListResponse {
  data: IEmployee[];
  pagination: IPagination;
}

export const employeeApi = {
  async getEmployees(params: EmployeeListParams = {}): Promise<IApiResponse<EmployeeListResponse>> {
    const response = await apiClient.get('/employees', { params });
    return response.data;
  },

  async getEmployeeById(id: string): Promise<IApiResponse<IEmployee>> {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  async createEmployee(employeeData: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  },

  async updateEmployee(id: string, employeeData: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  async deleteEmployee(id: string): Promise<IApiResponse<void>> {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },

  async getOnboardingSteps(id: string): Promise<IApiResponse<any>> {
    const response = await apiClient.get(`/employees/${id}/onboarding`);
    return response.data;
  },

  async updateOnboardingStep(id: string, step: number, data: any): Promise<IApiResponse<IEmployee>> {
    const response = await apiClient.put(`/employees/${id}/onboarding`, { step, data });
    return response.data;
  },

  async bulkImport(file: File, options: any = {}): Promise<IApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const response = await apiClient.post('/employees/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async exportEmployees(filters: any = {}): Promise<Blob> {
    const response = await apiClient.get('/employees/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
};