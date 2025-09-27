import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import PermissionGuard from '../Auth/PermissionGuard';

interface RoleBasedButtonProps extends ButtonProps {
  module: string;
  action: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

export default function RoleBasedButton({
  module,
  action,
  roles,
  fallback,
  children,
  ...buttonProps
}: RoleBasedButtonProps) {
  return (
    <PermissionGuard 
      module={module} 
      action={action} 
      fallback={fallback}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </PermissionGuard>
  );
}