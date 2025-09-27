import { QueryClient } from '@tanstack/react-query';

// Real-time data update helpers
export class RealTimeDataManager {
  private queryClient: QueryClient;
  private updateQueue: Map<string, any[]> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  // Queue updates for batching
  queueUpdate(queryKey: string[], data: any) {
    const key = JSON.stringify(queryKey);
    const existing = this.updateQueue.get(key) || [];
    this.updateQueue.set(key, [...existing, data]);

    // Batch updates to avoid excessive re-renders
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processBatchedUpdates();
    }, 100); // 100ms batch window
  }

  // Process all queued updates
  private processBatchedUpdates() {
    this.updateQueue.forEach((updates, keyString) => {
      const queryKey = JSON.parse(keyString);
      
      this.queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        // Apply all updates
        let newData = oldData;
        updates.forEach(update => {
          newData = this.applyUpdate(newData, update);
        });

        return newData;
      });
    });

    this.updateQueue.clear();
    this.batchTimeout = null;
  }

  // Apply individual update to data
  private applyUpdate(oldData: any, update: any): any {
    if (!oldData || !update) return oldData;

    // Handle different data structures
    if (Array.isArray(oldData.data)) {
      return this.updateArrayData(oldData, update);
    } else if (oldData.data && typeof oldData.data === 'object') {
      return this.updateObjectData(oldData, update);
    }

    return oldData;
  }

  // Update array-based data (lists, tables)
  private updateArrayData(oldData: any, update: any): any {
    const { data, pagination } = oldData;
    
    switch (update.operation) {
      case 'create':
        return {
          ...oldData,
          data: [update.data, ...data],
          pagination: pagination ? {
            ...pagination,
            total: pagination.total + 1,
          } : undefined,
        };
        
      case 'update':
        return {
          ...oldData,
          data: data.map((item: any) => 
            item._id === update.data._id ? { ...item, ...update.data } : item
          ),
        };
        
      case 'delete':
        return {
          ...oldData,
          data: data.filter((item: any) => item._id !== update.id),
          pagination: pagination ? {
            ...pagination,
            total: pagination.total - 1,
          } : undefined,
        };
        
      case 'status-change':
        return {
          ...oldData,
          data: data.map((item: any) => 
            item._id === update.id ? { ...item, status: update.status, ...update.changes } : item
          ),
        };
        
      default:
        return oldData;
    }
  }

  // Update object-based data
  private updateObjectData(oldData: any, update: any): any {
    return {
      ...oldData,
      data: {
        ...oldData.data,
        ...update.data,
      },
    };
  }

  // Invalidate queries with pattern matching
  invalidateQueries(pattern: string) {
    this.queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey.join(':');
        return queryKey.includes(pattern);
      },
    });
  }

  // Optimistic update with rollback
  optimisticUpdate(queryKey: string[], updater: (oldData: any) => any, rollbackDelay = 5000) {
    const previousData = this.queryClient.getQueryData(queryKey);
    
    this.queryClient.setQueryData(queryKey, updater);

    // Auto-rollback if not confirmed
    const rollbackTimer = setTimeout(() => {
      const currentData = this.queryClient.getQueryData(queryKey);
      if (currentData === updater(previousData)) {
        this.queryClient.setQueryData(queryKey, previousData);
      }
    }, rollbackDelay);

    return {
      confirm: () => clearTimeout(rollbackTimer),
      rollback: () => {
        clearTimeout(rollbackTimer);
        this.queryClient.setQueryData(queryKey, previousData);
      }
    };
  }
}

// Connection status manager
export class ConnectionManager {
  private listeners: Set<(status: boolean) => void> = new Set();
  private isOnline = navigator.onLine;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.reconnectAttempts = 0;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners(false);
  };

  private notifyListeners(status: boolean) {
    this.listeners.forEach(listener => listener(status));
  }

  subscribe(listener: (status: boolean) => void) {
    this.listeners.add(listener);
    // Immediately notify of current status
    listener(this.isOnline);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getStatus() {
    return this.isOnline;
  }

  async attemptReconnect(): Promise<boolean> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return false;
    }

    this.reconnectAttempts++;
    
    await new Promise(resolve => 
      setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts)
    );

    try {
      // Test connection with a simple request
      const response = await fetch('/api/v1/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        this.reconnectAttempts = 0;
        return true;
      }
    } catch (error) {
      console.warn(`Reconnect attempt ${this.reconnectAttempts} failed:`, error);
    }

    return false;
  }

  cleanup() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupObservers();
  }

  private setupObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordMetric('page-load', entry.duration);
          }
        });
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('/api/')) {
            this.recordMetric('api-response', entry.duration);
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  recordMetric(name: string, value: number) {
    const existing = this.metrics.get(name) || [];
    existing.push(value);
    
    // Keep only last 100 measurements
    if (existing.length > 100) {
      existing.shift();
    }
    
    this.metrics.set(name, existing);
  }

  getMetrics() {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      result[name] = {
        current: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });
    
    return result;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Export singleton instances
export const connectionManager = new ConnectionManager();
export const performanceMonitor = new PerformanceMonitor();

// Cleanup function for app unmount
export function cleanupRealTimeHelpers() {
  connectionManager.cleanup();
  performanceMonitor.cleanup();
}