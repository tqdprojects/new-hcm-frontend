import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../providers/SocketProvider';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

interface UseRealTimeDataOptions {
  queryKeys: string[][];
  events: string[];
  onUpdate?: (event: string, data: any) => void;
  enabled?: boolean;
  endpoint?: string;
}

export function useRealTimeData({
  queryKeys,
  events,
  onUpdate,
  enabled = true,
  endpoint
}: UseRealTimeDataOptions) {
  const { socket, isConnected, on, off } = useSocket();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const handleUpdate = useCallback((event: string, data: any) => {
    console.log(`🔄 Real-time update [${event}]:`, data);
    
    // Invalidate related queries
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });

    // Custom update handler
    if (onUpdate) {
      onUpdate(event, data);
    }

    // Show notification if specified
    if (data.notification) {
      addNotification({
        title: data.notification.title,
        message: data.notification.message,
        type: data.notification.type || 'info'
      });
    }
  }, [queryKeys, queryClient, onUpdate, addNotification]);

  useEffect(() => {
    if (!enabled || !socket || !isConnected) return;

    // Subscribe to events
    events.forEach(event => {
      on(event, (data) => handleUpdate(event, data));
    });

    return () => {
      // Cleanup event listeners
      events.forEach(event => {
        off(event);
      });
    };
  }, [socket, isConnected, events, on, off, handleUpdate, enabled]);

  return { isConnected };
}

// Specific hooks for different modules
export function useAttendanceRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['attendance-status'],
      ['attendance-history'],
      ['team-attendance']
    ],
    events: [
      'attendance:checkin',
      'attendance:checkout',
      'attendance:update',
      'attendance:regularization'
    ]
  });
}

export function useLeaveRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['leaves'],
      ['leave-balance'],
      ['pending-approvals'],
      ['team-leaves']
    ],
    events: [
      'leave:applied',
      'leave:approved',
      'leave:rejected',
      'leave:cancelled',
      'leave:status-change'
    ]
  });
}

export function usePerformanceRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['goals'],
      ['performance-reviews'],
      ['review-cycles']
    ],
    events: [
      'goal:assigned',
      'goal:updated',
      'goal:submitted',
      'goal:reviewed',
      'review:started',
      'review:completed',
      'review:reminder'
    ]
  });
}

export function usePayrollRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['payroll'],
      ['payslips'],
      ['salary-structures']
    ],
    events: [
      'payroll:processing',
      'payroll:processed',
      'payroll:approved',
      'payslip:generated'
    ]
  });
}

export function useClaimsRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['claims'],
      ['claim-approvals']
    ],
    events: [
      'claim:submitted',
      'claim:approved',
      'claim:rejected',
      'claim:paid',
      'claim:status-change'
    ]
  });
}

export function useRecruitmentRealTime() {
  return useRealTimeData({
    queryKeys: [
      ['jobs'],
      ['candidates'],
      ['interviews']
    ],
    events: [
      'application:received',
      'interview:scheduled',
      'interview:completed',
      'candidate:status-change',
      'job:published'
    ]
  });
}

export function useSystemRealTime() {
  const { user } = useAuthStore();
  
  return useRealTimeData({
    queryKeys: [
      ['system-health'],
      ['notifications'],
      ['audit-logs']
    ],
    events: [
      'system:notification',
      'system:alert',
      'system:maintenance',
      'security:alert'
    ],
    enabled: ['super-admin', 'tenant-admin'].includes(user?.role || '')
  });
}