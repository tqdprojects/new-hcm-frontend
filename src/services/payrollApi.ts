import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';
import { ISalaryComponent, ISalaryStructure, IEmployeeSalary } from '../types/payroll';

interface ComponentListParams {
  page?: number;
  limit?: number;
  type?: 'earning' | 'deduction';
  category?: string;
  isActive?: boolean;
  country?: string;
}

interface SalaryStructureParams {
  page?: number;
  limit?: number;
  department?: string;
  grade?: string;
  isActive?: boolean;
}

export const payrollApi = {
  // Salary Components Management
  async getSalaryComponents(params: ComponentListParams = {}): Promise<ApiResponse<{
    data: ISalaryComponent[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/payroll/components', { params });
    return response.data;
  },

  async getSalaryComponentById(id: string): Promise<ApiResponse<ISalaryComponent>> {
    const response = await apiClient.get(`/payroll/components/${id}`);
    return response.data;
  },

  async createSalaryComponent(data: Omit<ISalaryComponent, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ISalaryComponent>> {
    const response = await apiClient.post('/payroll/components', data);
    return response.data;
  },

  async updateSalaryComponent(id: string, data: Partial<ISalaryComponent>): Promise<ApiResponse<ISalaryComponent>> {
    const response = await apiClient.put(`/payroll/components/${id}`, data);
    return response.data;
  },

  async deleteSalaryComponent(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/payroll/components/${id}`);
    return response.data;
  },

  async getComponentCategories(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get('/payroll/components/categories');
    return response.data;
  },

  // Salary Structures Management
  async getSalaryStructures(params: SalaryStructureParams = {}): Promise<ApiResponse<{
    data: ISalaryStructure[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/payroll/structures', { params });
    return response.data;
  },

  async getSalaryStructureById(id: string): Promise<ApiResponse<ISalaryStructure>> {
    const response = await apiClient.get(`/payroll/structures/${id}`);
    return response.data;
  },

  async createSalaryStructure(data: Omit<ISalaryStructure, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ISalaryStructure>> {
    const response = await apiClient.post('/payroll/structures', data);
    return response.data;
  },

  async updateSalaryStructure(id: string, data: Partial<ISalaryStructure>): Promise<ApiResponse<ISalaryStructure>> {
    const response = await apiClient.put(`/payroll/structures/${id}`, data);
    return response.data;
  },

  async deleteSalaryStructure(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/payroll/structures/${id}`);
    return response.data;
  },

  async cloneSalaryStructure(id: string, name: string): Promise<ApiResponse<ISalaryStructure>> {
    const response = await apiClient.post(`/payroll/structures/${id}/clone`, { name });
    return response.data;
  },

  // Employee Salary Management
  async getEmployeeSalary(employeeId: string): Promise<ApiResponse<IEmployeeSalary>> {
    const response = await apiClient.get(`/payroll/employee-salary/${employeeId}`);
    return response.data;
  },

  async setEmployeeSalary(employeeId: string, data: {
    salaryStructureId?: string;
    customComponents?: any[];
    grossSalary: number;
    currency: string;
    effectiveDate: string;
  }): Promise<ApiResponse<IEmployeeSalary>> {
    const response = await apiClient.post(`/payroll/employee-salary/${employeeId}`, data);
    return response.data;
  },

  async updateEmployeeSalary(employeeId: string, data: Partial<IEmployeeSalary>): Promise<ApiResponse<IEmployeeSalary>> {
    const response = await apiClient.put(`/payroll/employee-salary/${employeeId}`, data);
    return response.data;
  },

  async getEmployeeSalaryHistory(employeeId: string): Promise<ApiResponse<IEmployeeSalary[]>> {
    const response = await apiClient.get(`/payroll/employee-salary/${employeeId}/history`);
    return response.data;
  },

  // Payroll Processing
  async calculateSalary(employeeId: string, month: number, year: number): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/payroll/calculate', {
      employeeId,
      month,
      year
    });
    return response.data;
  },

  async previewPayroll(structureId: string, overrides?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/payroll/preview', {
      structureId,
      overrides
    });
    return response.data;
  },

  // Bulk Operations
  async bulkUpdateSalaries(updates: Array<{
    employeeId: string;
    salaryData: Partial<IEmployeeSalary>;
  }>): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/payroll/bulk-update-salaries', { updates });
    return response.data;
  },

  async importSalaryStructures(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/payroll/import-structures', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};