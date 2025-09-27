import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { apiClient } from '../services/apiClient';
import { useNotificationStore } from '../stores/notificationStore';
import { ApiResponse, PaginationInfo } from '../types/api';

interface UseDynamicDataOptions<T> {
  endpoint: string;
  queryKey: string[];
  params?: Record<string, any>;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  transform?: (data: any) => T;
}

interface UseDynamicListOptions<T> extends UseDynamicDataOptions<T> {
  pagination?: {
    page: number;
    limit: number;
  };
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  search?: string;
}

// Generic hook for dynamic data fetching
export function useDynamicData<T = any>({
  endpoint,
  queryKey,
  params = {},
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchInterval,
  onSuccess,
  onError,
  transform
}: UseDynamicDataOptions<T>) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const response = await apiClient.get(endpoint, { params });
      const data = response.data;
      return transform ? transform(data) : data;
    },
    enabled,
    staleTime,
    refetchInterval,
    onSuccess,
    onError,
  });
}

// Hook for dynamic list data with pagination, filtering, and sorting
export function useDynamicList<T = any>({
  endpoint,
  queryKey,
  pagination = { page: 1, limit: 10 },
  filters = {},
  sorting,
  search,
  enabled = true,
  staleTime = 2 * 60 * 1000,
  onSuccess,
  onError,
  transform
}: UseDynamicListOptions<T>) {
  const [localPagination, setLocalPagination] = useState(pagination);
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSorting, setLocalSorting] = useState(sorting);
  const [localSearch, setLocalSearch] = useState(search || '');

  const params = useMemo(() => ({
    page: localPagination.page,
    limit: localPagination.limit,
    ...localFilters,
    ...(localSorting && {
      sortBy: localSorting.field,
      sortOrder: localSorting.direction
    }),
    ...(localSearch && { search: localSearch })
  }), [localPagination, localFilters, localSorting, localSearch]);

  const query = useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const response = await apiClient.get(endpoint, { params });
      const data = response.data;
      return transform ? transform(data) : data;
    },
    enabled,
    staleTime,
    onSuccess,
    onError,
  });

  const updatePagination = useCallback((newPagination: Partial<typeof pagination>) => {
    setLocalPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setLocalFilters(newFilters);
    setLocalPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const updateSorting = useCallback((field: string, direction: 'asc' | 'desc') => {
    setLocalSorting({ field, direction });
  }, []);

  const updateSearch = useCallback((searchTerm: string) => {
    setLocalSearch(searchTerm);
    setLocalPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const clearFilters = useCallback(() => {
    setLocalFilters({});
    setLocalSearch('');
    setLocalPagination({ page: 1, limit: 10 });
  }, []);

  return {
    ...query,
    pagination: localPagination,
    filters: localFilters,
    sorting: localSorting,
    search: localSearch,
    updatePagination,
    updateFilters,
    updateSorting,
    updateSearch,
    clearFilters,
  };
}

// Hook for dynamic mutations with optimistic updates
export function useDynamicMutation<TData = any, TVariables = any>({
  endpoint,
  method = 'POST',
  invalidateQueries = [],
  optimisticUpdate,
  onSuccess,
  onError,
}: {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  invalidateQueries?: string[][];
  optimisticUpdate?: {
    queryKey: string[];
    updater: (oldData: any, variables: TVariables) => any;
  };
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
}) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      let response;
      
      switch (method) {
        case 'POST':
          response = await apiClient.post(endpoint, variables);
          break;
        case 'PUT':
          response = await apiClient.put(endpoint, variables);
          break;
        case 'PATCH':
          response = await apiClient.patch(endpoint, variables);
          break;
        case 'DELETE':
          response = await apiClient.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    },
    onMutate: async (variables) => {
      if (optimisticUpdate) {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey });

        // Snapshot previous value
        const previousData = queryClient.getQueryData(optimisticUpdate.queryKey);

        // Optimistically update
        queryClient.setQueryData(optimisticUpdate.queryKey, (old: any) => 
          optimisticUpdate.updater(old, variables)
        );

        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData);
      }

      if (onError) {
        onError(error, variables);
      } else {
        addNotification({
          title: 'Operation Failed',
          message: error.response?.data?.error || 'An unexpected error occurred',
          type: 'error'
        });
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
  });
}

// Hook for real-time data synchronization
export function useRealTimeSync<T = any>({
  queryKey,
  socketEvent,
  enabled = true
}: {
  queryKey: string[];
  socketEvent: string;
  enabled?: boolean;
}) {
  const { on, off, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isConnected) return;

    const handleUpdate = (data: any) => {
      // Update query data in real-time
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return data;
        
        // Merge or replace data based on structure
        if (Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((item: any) => 
              item._id === data._id ? { ...item, ...data } : item
            )
          };
        }
        
        return { ...oldData, ...data };
      });
    };

    on(socketEvent, handleUpdate);

    return () => {
      off(socketEvent, handleUpdate);
    };
  }, [queryKey, socketEvent, enabled, isConnected, on, off, queryClient]);

  return { isConnected };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T = any>() {
  const queryClient = useQueryClient();

  const updateOptimistically = useCallback((
    queryKey: string[],
    updater: (oldData: T) => T,
    rollbackDelay = 5000
  ) => {
    const previousData = queryClient.getQueryData<T>(queryKey);
    
    queryClient.setQueryData(queryKey, updater);

    // Auto-rollback after delay if no confirmation
    const rollbackTimer = setTimeout(() => {
      const currentData = queryClient.getQueryData<T>(queryKey);
      if (currentData === updater(previousData as T)) {
        queryClient.setQueryData(queryKey, previousData);
      }
    }, rollbackDelay);

    return {
      confirm: () => clearTimeout(rollbackTimer),
      rollback: () => {
        clearTimeout(rollbackTimer);
        queryClient.setQueryData(queryKey, previousData);
      }
    };
  }, [queryClient]);

  return { updateOptimistically };
}

// Hook for infinite scrolling
export function useInfiniteData<T = any>({
  endpoint,
  queryKey,
  pageSize = 20,
  enabled = true
}: {
  endpoint: string;
  queryKey: string[];
  pageSize?: number;
  enabled?: boolean;
}) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get(endpoint, {
        params: { page: pageParam, limit: pageSize }
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook for data polling
export function usePollingData<T = any>({
  endpoint,
  queryKey,
  interval = 30000,
  enabled = true
}: {
  endpoint: string;
  queryKey: string[];
  interval?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    enabled,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider stale for polling
  });
}