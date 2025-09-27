import { apiClient } from './apiClient';
import { ITimesheet, IProject, IClient, ITask } from '../types';
import { ApiResponse, PaginationInfo } from '../types/api';

interface TimesheetListParams {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  month?: number;
  year?: number;
}

interface TimesheetEntryData {
  date: string;
  projectId?: string;
  taskId?: string;
  clientId?: string;
  hours: number;
  description: string;
  billable?: boolean;
}

interface TimesheetSubmissionData {
  comments?: string;
}

interface ProjectData {
  name: string;
  code?: string;
  description?: string;
  clientId?: string;
  managerId: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  currency?: string;
  billableRate?: number;
  teamMembers?: string[];
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface ClientData {
  name: string;
  code?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contractValue?: number;
  currency?: string;
  industry?: string;
  website?: string;
  notes?: string;
}

export const timesheetApi = {
  async getTimesheets(params: TimesheetListParams = {}): Promise<ApiResponse<{
    data: ITimesheet[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/timesheets', { params });
    return response.data;
  },

  async getTimesheetById(id: string): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.get(`/timesheets/${id}`);
    return response.data;
  },

  async createTimesheet(month: number, year: number): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.post('/timesheets', { month, year });
    return response.data;
  },

  async addTimesheetEntry(timesheetId: string, data: TimesheetEntryData): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.post(`/timesheets/${timesheetId}/entries`, data);
    return response.data;
  },

  async updateTimesheetEntry(timesheetId: string, entryId: string, data: Partial<TimesheetEntryData>): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.put(`/timesheets/${timesheetId}/entries/${entryId}`, data);
    return response.data;
  },

  async deleteTimesheetEntry(timesheetId: string, entryId: string): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.delete(`/timesheets/${timesheetId}/entries/${entryId}`);
    return response.data;
  },

  async submitTimesheet(id: string, data: TimesheetSubmissionData): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.put(`/timesheets/${id}/submit`, data);
    return response.data;
  },

  async approveTimesheet(id: string, comments?: string): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.put(`/timesheets/${id}/approve`, { comments });
    return response.data;
  },

  async rejectTimesheet(id: string, comments: string): Promise<ApiResponse<ITimesheet>> {
    const response = await apiClient.put(`/timesheets/${id}/reject`, { comments });
    return response.data;
  },

  // Project Management
  async getProjects(status?: string): Promise<ApiResponse<IProject[]>> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/timesheets/projects', { params });
    return response.data;
  },

  async createProject(data: ProjectData): Promise<ApiResponse<IProject>> {
    const response = await apiClient.post('/timesheets/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<ProjectData>): Promise<ApiResponse<IProject>> {
    const response = await apiClient.put(`/timesheets/projects/${id}`, data);
    return response.data;
  },

  // Client Management
  async getClients(isActive?: boolean): Promise<ApiResponse<IClient[]>> {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await apiClient.get('/timesheets/clients', { params });
    return response.data;
  },

  async createClient(data: ClientData): Promise<ApiResponse<IClient>> {
    const response = await apiClient.post('/timesheets/clients', data);
    return response.data;
  },

  async updateClient(id: string, data: Partial<ClientData>): Promise<ApiResponse<IClient>> {
    const response = await apiClient.put(`/timesheets/clients/${id}`, data);
    return response.data;
  },

  // Task Management
  async getTasks(projectId?: string): Promise<ApiResponse<ITask[]>> {
    const params = projectId ? { projectId } : {};
    const response = await apiClient.get('/timesheets/tasks', { params });
    return response.data;
  },

  async createTask(data: any): Promise<ApiResponse<ITask>> {
    const response = await apiClient.post('/timesheets/tasks', data);
    return response.data;
  },

  // Reports
  async getTimesheetReport(params: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/timesheets/reports', { params });
    return response.data;
  },

  async exportTimesheet(id: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await apiClient.get(`/timesheets/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }
};