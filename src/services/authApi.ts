import { apiClient } from './apiClient';
import { IUser, IEmployee, ITenant, ApiResponse } from '../types';

interface LoginResponse {
  user: IUser;
  employee?: IEmployee;
  tenant: ITenant;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  requireMFA?: boolean;
}

interface ProfileResponse {
  user: IUser;
  employee?: IEmployee;
  tenant: ITenant;
}

export const authApi = {
  async login(email: string, password: string, mfaToken?: string): Promise<{ data: LoginResponse; requireMFA?: boolean }> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      mfaToken,
    });
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantId: string;
    role?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  async enableMFA(): Promise<ApiResponse<{ qrCode: string; backupCodes: string[] }>> {
    const response = await apiClient.post('/auth/enable-mfa');
    return response.data;
  },

  async verifyMFA(token: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/verify-mfa', { token });
    return response.data;
  },
};