import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../services/subscriptionApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

// Subscription Plan Hooks
export const useSubscriptionPlans = (params: any = {}) => {
  return useQuery({
    queryKey: ['subscription-plans', params],
    queryFn: () => subscriptionApi.getPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubscriptionPlan = (id: string) => {
  return useQuery({
    queryKey: ['subscription-plan', id],
    queryFn: () => subscriptionApi.getPlanById(id),
    enabled: !!id,
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => subscriptionApi.createPlan(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      
      emit('subscription:plan-created', {
        planId: response.data._id,
        name: response.data.name,
        type: response.data.type
      });

      addNotification({
        title: 'Plan Created',
        message: `Subscription plan "${response.data.name}" has been created successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Plan Creation Failed',
        message: error.response?.data?.error || 'Failed to create subscription plan',
        type: 'error'
      });
    }
  });
};

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      subscriptionApi.updatePlan(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plan', variables.id] });
      
      addNotification({
        title: 'Plan Updated',
        message: 'Subscription plan has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Plan Update Failed',
        message: error.response?.data?.error || 'Failed to update subscription plan',
        type: 'error'
      });
    }
  });
};

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => subscriptionApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      
      addNotification({
        title: 'Plan Deleted',
        message: 'Subscription plan has been deleted successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Plan Deletion Failed',
        message: error.response?.data?.error || 'Failed to delete subscription plan',
        type: 'error'
      });
    }
  });
};

export const useCloneSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      subscriptionApi.clonePlan(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      
      addNotification({
        title: 'Plan Cloned',
        message: 'Subscription plan has been cloned successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Plan Cloning Failed',
        message: error.response?.data?.error || 'Failed to clone subscription plan',
        type: 'error'
      });
    }
  });
};

// Subscription Management Hooks
export const useSubscriptions = (params: any = {}) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptionApi.getSubscriptions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionApi.getSubscriptionById(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => subscriptionApi.createSubscription(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      addNotification({
        title: 'Subscription Created',
        message: 'New subscription has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Subscription Creation Failed',
        message: error.response?.data?.error || 'Failed to create subscription',
        type: 'error'
      });
    }
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, newPlanId, effectiveDate }: { id: string; newPlanId: string; effectiveDate?: string }) => 
      subscriptionApi.upgradeSubscription(id, newPlanId, effectiveDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      
      addNotification({
        title: 'Subscription Upgraded',
        message: 'Subscription has been upgraded successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Upgrade Failed',
        message: error.response?.data?.error || 'Failed to upgrade subscription',
        type: 'error'
      });
    }
  });
};

// Analytics Hooks
export const usePlanAnalytics = () => {
  return useQuery({
    queryKey: ['plan-analytics'],
    queryFn: () => subscriptionApi.getPlanAnalytics(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueAnalytics = (period: string = '12m') => {
  return useQuery({
    queryKey: ['revenue-analytics', period],
    queryFn: () => subscriptionApi.getRevenueAnalytics(period),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAvailableFeatures = () => {
  return useQuery({
    queryKey: ['available-features'],
    queryFn: () => subscriptionApi.getAvailableFeatures(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUsageAnalytics = (subscriptionId: string, period: string = '30d') => {
  return useQuery({
    queryKey: ['usage-analytics', subscriptionId, period],
    queryFn: () => subscriptionApi.getUsageAnalytics(subscriptionId, period),
    enabled: !!subscriptionId,
    staleTime: 2 * 60 * 1000,
  });
};