import { apiClient } from './apiClient';
import { IAttendance } from '../types';
import { IApiResponse, IPagination } from '../types/api';

interface AttendanceHistoryParams {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
}

interface CheckInData {
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  device?: string;
  selfieUrl?: string;
}

interface CheckOutData {
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

interface RegularizationData {
  date: string;
  reason: string;
  checkIn?: string;
  checkOut?: string;
}

export const attendanceApi = {
  async checkIn(data: CheckInData): Promise<IApiResponse<IAttendance>> {
    const response = await apiClient.post('/attendance/checkin', data);
    return response.data;
  },

  async checkOut(data: CheckOutData): Promise<IApiResponse<IAttendance>> {
    const response = await apiClient.post('/attendance/checkout', data);
    return response.data;
  },

  async getCurrentStatus(): Promise<IApiResponse<any>> {
    const response = await apiClient.get('/attendance/status');
    return response.data;
  },

  async getAttendanceHistory(params: AttendanceHistoryParams = {}): Promise<IApiResponse<{
    data: IAttendance[];
    pagination: IPagination;
  }>> {
    const response = await apiClient.get('/attendance/history', { params });
    return response.data;
  },

  async requestRegularization(data: RegularizationData): Promise<IApiResponse<IAttendance>> {
    const response = await apiClient.post('/attendance/regularization', data);
    return response.data;
  },

  async getTeamAttendance(date?: string): Promise<IApiResponse<any>> {
    const response = await apiClient.get('/attendance/team', {
      params: date ? { date } : {}
    });
    return response.data;
  },

  async approveRegularization(attendanceId: string, comments?: string): Promise<IApiResponse<IAttendance>> {
    const response = await apiClient.put(`/attendance/${attendanceId}/regularization/approve`, {
      comments
    });
    return response.data;
  },

  async rejectRegularization(attendanceId: string, comments: string): Promise<IApiResponse<IAttendance>> {
    const response = await apiClient.put(`/attendance/${attendanceId}/regularization/reject`, {
      comments
    });
    return response.data;
  }
};