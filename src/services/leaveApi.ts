import { apiClient } from './apiClient';
import { ILeave, ILeaveType, ILeaveBalance } from '../types';
import { ApiResponse, PaginationInfo } from '../types/api';

interface LeaveListParams {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

interface LeaveApplicationData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  halfDay?: boolean;
  halfDayPeriod?: 'first-half' | 'second-half';
  documents?: string[];
}

interface LeaveApprovalData {
  comments?: string;
}

interface LeaveCalendarParams {
  month?: number;
  year?: number;
  department?: string;
}

export const leaveApi = {
  async getLeaves(params: LeaveListParams = {}): Promise<ApiResponse<{
    data: ILeave[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/leaves', { params });
    return response.data;
  },

  async getLeaveById(id: string): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.get(`/leaves/${id}`);
    return response.data;
  },

  async applyLeave(data: LeaveApplicationData): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.post('/leaves', data);
    return response.data;
  },

  async updateLeave(id: string, data: Partial<LeaveApplicationData>): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.put(`/leaves/${id}`, data);
    return response.data;
  },

  async approveLeave(id: string, data: LeaveApprovalData): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.put(`/leaves/${id}/approve`, data);
    return response.data;
  },

  async rejectLeave(id: string, data: LeaveApprovalData): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.put(`/leaves/${id}/reject`, data);
    return response.data;
  },

  async cancelLeave(id: string, reason: string): Promise<ApiResponse<ILeave>> {
    const response = await apiClient.put(`/leaves/${id}/cancel`, { reason });
    return response.data;
  },

  async getLeaveBalance(employeeId: string, year?: number): Promise<ApiResponse<Record<string, ILeaveBalance>>> {
    const params = year ? { year } : {};
    const response = await apiClient.get(`/leaves/balance/${employeeId}`, { params });
    return response.data;
  },

  async getLeaveTypes(): Promise<ApiResponse<ILeaveType[]>> {
    const response = await apiClient.get('/leaves/types');
    return response.data;
  },

  async getLeaveCalendar(params: LeaveCalendarParams = {}): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/leaves/calendar', { params });
    return response.data;
  },

  async getPendingApprovals(): Promise<ApiResponse<ILeave[]>> {
    const response = await apiClient.get('/leaves', { 
      params: { status: 'pending', limit: 100 } 
    });
    return response.data;
  },

  async getTeamLeaves(managerId?: string): Promise<ApiResponse<ILeave[]>> {
    const params = managerId ? { managerId } : {};
    const response = await apiClient.get('/leaves/team', { params });
    return response.data;
  },

  async bulkApprove(leaveIds: string[], comments?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/leaves/bulk-approve', {
      leaveIds,
      comments
    });
    return response.data;
  },

  async exportLeaves(params: LeaveListParams = {}): Promise<Blob> {
    const response = await apiClient.get('/leaves/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  }
};