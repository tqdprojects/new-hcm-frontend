import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { TenantAdminDashboard } from './TenantAdminDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { HRDashboard } from './HRDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'tenant-admin':
        return <TenantAdminDashboard />;
      case 'finance':
        return <FinanceDashboard />;
      case 'hr':
        return <HRDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return renderDashboard();
};