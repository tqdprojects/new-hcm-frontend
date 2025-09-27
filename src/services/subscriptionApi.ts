import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';
import { ISubscriptionPlan, ISubscription, IPlanFeature } from '../types/subscription';

interface PlanListParams {
  page?: number;
  limit?: number;
  type?: string;
  isActive?: boolean;
  search?: string;
}

interface PlanCreateData {
  name: string;
  code: string;
  description: string;
  type: 'starter' | 'professional' | 'enterprise' | 'custom';
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly' | 'both';
    trialDays: number;
    setupFee?: number;
    discountPercentage?: number;
  };
  features: IPlanFeature[];
  limits: {
    maxEmployees: number;
    maxAdmins: number;
    maxBranches: number;
    storageGB: number;
    apiCallsPerMonth: number;
    supportLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
    customIntegrations: number;
    advancedReporting: boolean;
    aiFeatures: boolean;
    multiCurrency: boolean;
    globalPayroll: boolean;
  };
  isActive?: boolean;
  isDefault?: boolean;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

interface SubscriptionCreateData {
  tenantId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  autoRenew?: boolean;
  paymentMethodId?: string;
  promoCode?: string;
}

export const subscriptionApi = {
  // Subscription Plan Management
  async getPlans(params: PlanListParams = {}): Promise<ApiResponse<{
    data: ISubscriptionPlan[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/super-admin/subscription-plans', { params });
    return response.data;
  },

  async getPlanById(id: string): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.get(`/super-admin/subscription-plans/${id}`);
    return response.data;
  },

  async createPlan(data: PlanCreateData): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.post('/super-admin/subscription-plans', data);
    return response.data;
  },

  async updatePlan(id: string, data: Partial<PlanCreateData>): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.put(`/super-admin/subscription-plans/${id}`, data);
    return response.data;
  },

  async deletePlan(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/super-admin/subscription-plans/${id}`);
    return response.data;
  },

  async clonePlan(id: string, name: string): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.post(`/super-admin/subscription-plans/${id}/clone`, { name });
    return response.data;
  },

  async togglePlanStatus(id: string, isActive: boolean): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.patch(`/super-admin/subscription-plans/${id}/status`, { isActive });
    return response.data;
  },

  async setDefaultPlan(id: string): Promise<ApiResponse<ISubscriptionPlan>> {
    const response = await apiClient.patch(`/super-admin/subscription-plans/${id}/set-default`);
    return response.data;
  },

  async reorderPlans(planIds: string[]): Promise<ApiResponse<void>> {
    const response = await apiClient.put('/super-admin/subscription-plans/reorder', { planIds });
    return response.data;
  },

  // Available Features Management
  async getAvailableFeatures(): Promise<ApiResponse<IPlanFeature[]>> {
    const response = await apiClient.get('/super-admin/subscription-plans/features');
    return response.data;
  },

  async createFeature(data: {
    name: string;
    description: string;
    category: string;
    defaultLimit?: number;
    unit?: string;
  }): Promise<ApiResponse<IPlanFeature>> {
    const response = await apiClient.post('/super-admin/subscription-plans/features', data);
    return response.data;
  },

  // Subscription Management
  async getSubscriptions(params: any = {}): Promise<ApiResponse<{
    data: ISubscription[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/super-admin/subscriptions', { params });
    return response.data;
  },

  async getSubscriptionById(id: string): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.get(`/super-admin/subscriptions/${id}`);
    return response.data;
  },

  async createSubscription(data: SubscriptionCreateData): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.post('/super-admin/subscriptions', data);
    return response.data;
  },

  async updateSubscription(id: string, data: Partial<SubscriptionCreateData>): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.put(`/super-admin/subscriptions/${id}`, data);
    return response.data;
  },

  async cancelSubscription(id: string, reason: string, effectiveDate?: string): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.post(`/super-admin/subscriptions/${id}/cancel`, {
      reason,
      effectiveDate
    });
    return response.data;
  },

  async renewSubscription(id: string, planId?: string): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.post(`/super-admin/subscriptions/${id}/renew`, { planId });
    return response.data;
  },

  async upgradeSubscription(id: string, newPlanId: string, effectiveDate?: string): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.post(`/super-admin/subscriptions/${id}/upgrade`, {
      newPlanId,
      effectiveDate
    });
    return response.data;
  },

  async downgradeSubscription(id: string, newPlanId: string, effectiveDate?: string): Promise<ApiResponse<ISubscription>> {
    const response = await apiClient.post(`/super-admin/subscriptions/${id}/downgrade`, {
      newPlanId,
      effectiveDate
    });
    return response.data;
  },

  // Usage Analytics
  async getUsageAnalytics(subscriptionId: string, period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/super-admin/subscriptions/${subscriptionId}/usage`, {
      params: { period }
    });
    return response.data;
  },

  async getPlatformUsage(period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/super-admin/platform-usage', {
      params: { period }
    });
    return response.data;
  },

  // Billing & Invoicing
  async generateInvoice(subscriptionId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/super-admin/subscriptions/${subscriptionId}/invoice`);
    return response.data;
  },

  async getInvoices(params: any = {}): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/super-admin/invoices', { params });
    return response.data;
  },

  async downloadInvoice(invoiceId: string): Promise<Blob> {
    const response = await apiClient.get(`/super-admin/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Plan Analytics
  async getPlanAnalytics(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/super-admin/subscription-plans/analytics');
    return response.data;
  },

  async getRevenueAnalytics(period: string = '12m'): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/super-admin/revenue-analytics', {
      params: { period }
    });
    return response.data;
  }
};