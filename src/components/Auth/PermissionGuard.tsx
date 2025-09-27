import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Alert, Box } from '@mui/material';

interface PermissionGuardProps {
  children: React.ReactNode;
  module: string;
  action: string;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export default function PermissionGuard({ 
  children, 
  module, 
  action, 
  fallback = null,
  showError = false 
}: PermissionGuardProps) {
  const { hasPermission, user } = useAuthStore();

  if (!hasPermission(module, action)) {
    if (showError) {
      return (
        <Alert severity="warning">
          You don't have permission to {action} {module}. 
          Current role: {user?.role?.replace('-', ' ').toUpperCase()}
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for permission checking
export function usePermissions() {
  const { hasPermission, canAccess, user } = useAuthStore();

  return {
    hasPermission,
    canAccess,
    isAdmin: user?.role === 'tenant-admin' || user?.role === 'super-admin',
    isHR: user?.role === 'hr',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    isSuperAdmin: user?.role === 'super-admin',
    role: user?.role,
    canManageUsers: ['super-admin', 'tenant-admin'].includes(user?.role || ''),
    canConfigureSystem: ['super-admin', 'tenant-admin'].includes(user?.role || ''),
    canProcessPayroll: ['super-admin', 'tenant-admin', 'finance', 'hr'].includes(user?.role || ''),
    canManageRecruitment: ['super-admin', 'tenant-admin', 'hr'].includes(user?.role || ''),
    canApproveClaims: ['super-admin', 'tenant-admin', 'finance', 'hr', 'manager'].includes(user?.role || ''),
    canManageFinance: ['super-admin', 'tenant-admin', 'finance'].includes(user?.role || ''),
    canViewFinancialReports: ['super-admin', 'tenant-admin', 'finance'].includes(user?.role || ''),
  };
}