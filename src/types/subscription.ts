export interface ISubscriptionPlan {
  _id?: string;
  name: string;
  code: string;
  description: string;
  type: 'starter' | 'professional' | 'enterprise' | 'custom';
  pricing: IPlanPricing;
  features: IPlanFeature[];
  limits: IPlanLimits;
  isActive: boolean;
  isDefault: boolean;
  displayOrder: number;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlanPricing {
  monthly: number;
  yearly: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'both';
  trialDays: number;
  setupFee?: number;
  discountPercentage?: number;
}

export interface IPlanFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'premium' | 'addon';
  isIncluded: boolean;
  limit?: number;
  unit?: string;
}

export interface IPlanLimits {
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
}

export interface ISubscription {
  _id?: string;
  tenantId: string;
  planId: string;
  plan: ISubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  billingCycle: 'monthly' | 'yearly';
  pricing: {
    baseAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
  };
  usage: IUsageMetrics;
  paymentMethod?: IPaymentMethod;
  invoices: IInvoice[];
  isActive: boolean;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsageMetrics {
  employees: number;
  admins: number;
  branches: number;
  storageUsedGB: number;
  apiCallsThisMonth: number;
  lastUpdated: Date;
}

export interface IPaymentMethod {
  type: 'card' | 'bank' | 'invoice';
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  downloadUrl?: string;
}

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past-due',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

export enum PlanType {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom'
}