import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';

// Generic API service for dynamic endpoints
class DynamicApiService {
  // Generic CRUD operations
  async getList<T = any>(
    endpoint: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: Record<string, any>;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ApiResponse<{ data: T[]; pagination: PaginationInfo }>> {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  }

  async getById<T = any>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    const response = await apiClient.get(`${endpoint}/${id}`);
    return response.data;
  }

  async create<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }

  async update<T = any>(endpoint: string, id: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    return response.data;
  }

  async patch<T = any>(endpoint: string, id: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.patch(`${endpoint}/${id}`, data);
    return response.data;
  }

  async delete(endpoint: string, id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${endpoint}/${id}`);
    return response.data;
  }

  async bulkOperation<T = any>(
    endpoint: string,
    operation: 'create' | 'update' | 'delete',
    data: any
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post(`${endpoint}/bulk-${operation}`, data);
    return response.data;
  }

  // File operations
  async uploadFile(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
    }

    const response = await apiClient.uploadFile(endpoint, file, onProgress);
    return response.data;
  }

  async downloadFile(endpoint: string, filename?: string): Promise<Blob> {
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
    });

    // Trigger download
    if (filename) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return response.data;
  }

  // Search operations
  async search<T = any>(
    endpoint: string,
    query: string,
    filters?: Record<string, any>
  ): Promise<ApiResponse<T[]>> {
    const response = await apiClient.get(`${endpoint}/search`, {
      params: { q: query, ...filters }
    });
    return response.data;
  }

  // Analytics operations
  async getAnalytics<T = any>(
    endpoint: string,
    params: {
      startDate?: string;
      endDate?: string;
      groupBy?: string;
      metrics?: string[];
    } = {}
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get(`${endpoint}/analytics`, { params });
    return response.data;
  }

  // Export operations
  async exportData(
    endpoint: string,
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: Record<string, any>
  ): Promise<Blob> {
    const response = await apiClient.get(`${endpoint}/export`, {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  }

  // Approval operations
  async approve(endpoint: string, id: string, comments?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${endpoint}/${id}/approve`, { comments });
    return response.data;
  }

  async reject(endpoint: string, id: string, comments: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${endpoint}/${id}/reject`, { comments });
    return response.data;
  }

  // Workflow operations
  async submitForApproval(endpoint: string, id: string, data?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${endpoint}/${id}/submit`, data);
    return response.data;
  }

  async delegate(endpoint: string, id: string, delegateTo: string, comments?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${endpoint}/${id}/delegate`, {
      delegateTo,
      comments
    });
    return response.data;
  }

  // Notification operations
  async markAsRead(endpoint: string, id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.patch(`${endpoint}/${id}/read`);
    return response.data;
  }

  async markAllAsRead(endpoint: string): Promise<ApiResponse<void>> {
    const response = await apiClient.patch(`${endpoint}/read-all`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  // Custom operations
  async customOperation<T = any>(
    endpoint: string,
    operation: string,
    data?: any,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
  ): Promise<ApiResponse<T>> {
    const url = `${endpoint}/${operation}`;
    
    let response;
    switch (method) {
      case 'GET':
        response = await apiClient.get(url, { params: data });
        break;
      case 'POST':
        response = await apiClient.post(url, data);
        break;
      case 'PUT':
        response = await apiClient.put(url, data);
        break;
      case 'PATCH':
        response = await apiClient.patch(url, data);
        break;
      case 'DELETE':
        response = await apiClient.delete(url);
        break;
    }
    
    return response.data;
  }
}

export const dynamicApi = new DynamicApiService();

// Specific service instances for different modules
export const employeeService = {
  getList: (params?: any) => dynamicApi.getList('/employees', params),
  getById: (id: string) => dynamicApi.getById('/employees', id),
  create: (data: any) => dynamicApi.create('/employees', data),
  update: (id: string, data: any) => dynamicApi.update('/employees', id, data),
  delete: (id: string) => dynamicApi.delete('/employees', id),
  search: (query: string, filters?: any) => dynamicApi.search('/employees', query, filters),
  export: (filters?: any) => dynamicApi.exportData('/employees', 'excel', filters),
  bulkImport: (file: File) => dynamicApi.uploadFile('/employees/bulk-import', file),
};

export const attendanceService = {
  checkIn: (data: any) => dynamicApi.create('/attendance/checkin', data),
  checkOut: (data: any) => dynamicApi.create('/attendance/checkout', data),
  getStatus: () => dynamicApi.customOperation('/attendance', 'status', {}, 'GET'),
  getHistory: (params?: any) => dynamicApi.getList('/attendance/history', params),
  requestRegularization: (data: any) => dynamicApi.create('/attendance/regularization', data),
  approveRegularization: (id: string, comments?: string) => 
    dynamicApi.approve('/attendance/regularization', id, comments),
};

export const leaveService = {
  getList: (params?: any) => dynamicApi.getList('/leaves', params),
  getById: (id: string) => dynamicApi.getById('/leaves', id),
  apply: (data: any) => dynamicApi.create('/leaves', data),
  approve: (id: string, comments?: string) => dynamicApi.approve('/leaves', id, comments),
  reject: (id: string, comments: string) => dynamicApi.reject('/leaves', id, comments),
  cancel: (id: string, reason: string) => 
    dynamicApi.customOperation('/leaves', `${id}/cancel`, { reason }, 'PUT'),
  getBalance: (employeeId: string, year?: number) => 
    dynamicApi.customOperation('/leaves', `balance/${employeeId}`, { year }, 'GET'),
  getTypes: () => dynamicApi.getList('/leaves/types'),
};

export const performanceService = {
  getGoals: (params?: any) => dynamicApi.getList('/performance/goals', params),
  createGoal: (data: any) => dynamicApi.create('/performance/goals', data),
  updateGoal: (id: string, data: any) => dynamicApi.update('/performance/goals', id, data),
  submitGoal: (id: string, data: any) => 
    dynamicApi.customOperation('/performance/goals', `${id}/submit`, data, 'PUT'),
  reviewGoal: (id: string, data: any) => 
    dynamicApi.customOperation('/performance/goals', `${id}/review`, data, 'PUT'),
  getReviews: (params?: any) => dynamicApi.getList('/performance/reviews', params),
  submitSelfReview: (id: string, data: any) => 
    dynamicApi.customOperation('/performance/reviews', `${id}/self-review`, data, 'PUT'),
  submitManagerReview: (id: string, data: any) => 
    dynamicApi.customOperation('/performance/reviews', `${id}/manager-review`, data, 'PUT'),
};

export const payrollService = {
  getRuns: (params?: any) => dynamicApi.getList('/payroll/runs', params),
  createRun: (data: any) => dynamicApi.create('/payroll/runs', data),
  processRun: (id: string) => 
    dynamicApi.customOperation('/payroll/runs', `${id}/process`, {}, 'POST'),
  approveRun: (id: string, comments?: string) => 
    dynamicApi.approve('/payroll/runs', id, comments),
  getPayslips: (params?: any) => dynamicApi.getList('/payroll/payslips', params),
  downloadPayslip: (id: string) => dynamicApi.downloadFile(`/payroll/payslips/${id}/download`),
};

export const claimsService = {
  getList: (params?: any) => dynamicApi.getList('/claims', params),
  getById: (id: string) => dynamicApi.getById('/claims', id),
  submit: (data: any) => dynamicApi.create('/claims', data),
  approve: (id: string, comments?: string) => dynamicApi.approve('/claims', id, comments),
  reject: (id: string, comments: string) => dynamicApi.reject('/claims', id, comments),
  uploadReceipt: (claimId: string, file: File) => 
    dynamicApi.uploadFile(`/claims/${claimId}/receipts`, file),
};

export const recruitmentService = {
  getJobs: (params?: any) => dynamicApi.getList('/recruitment/jobs', params),
  getCandidates: (params?: any) => dynamicApi.getList('/recruitment/candidates', params),
  scheduleInterview: (data: any) => dynamicApi.create('/recruitment/interviews', data),
  updateCandidateStatus: (id: string, status: string, comments?: string) => 
    dynamicApi.customOperation('/recruitment/candidates', `${id}/status`, { status, comments }, 'PUT'),
};

export const assetService = {
  getList: (params?: any) => dynamicApi.getList('/assets', params),
  assign: (assetId: string, employeeId: string, comments?: string) => 
    dynamicApi.customOperation('/assets', `${assetId}/assign`, { employeeId, comments }, 'PUT'),
  unassign: (assetId: string, reason?: string) => 
    dynamicApi.customOperation('/assets', `${assetId}/unassign`, { reason }, 'PUT'),
  scheduleMaintenance: (assetId: string, data: any) => 
    dynamicApi.customOperation('/assets', `${assetId}/maintenance`, data, 'POST'),
};

export const documentService = {
  getList: (params?: any) => dynamicApi.getList('/documents', params),
  upload: (file: File, metadata?: any) => dynamicApi.uploadFile('/documents/upload', file, metadata),
  generate: (templateId: string, data: any) => 
    dynamicApi.customOperation('/documents', 'generate', { templateId, ...data }, 'POST'),
  approve: (id: string, comments?: string) => dynamicApi.approve('/documents', id, comments),
  download: (id: string, filename?: string) => dynamicApi.downloadFile(`/documents/${id}/download`, filename),
};

export const analyticsService = {
  getDashboardMetrics: (module: string, params?: any) => 
    dynamicApi.getAnalytics(`/analytics/${module}/dashboard`, params),
  getCustomReport: (reportId: string, params?: any) => 
    dynamicApi.getAnalytics(`/analytics/reports/${reportId}`, params),
  exportReport: (reportId: string, format: 'csv' | 'excel' | 'pdf' = 'excel') => 
    dynamicApi.exportData(`/analytics/reports/${reportId}`, format),
};