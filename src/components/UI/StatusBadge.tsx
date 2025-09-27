import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
+  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'warning' | 'success' | 'error' | 'info';
+  pulse?: boolean;
+}
+
+const StatusBadge: React.FC<StatusBadgeProps> = ({
+  status,
+  pulse = false,
+  sx,
+  ...props
+}) => {
+  const getStatusConfig = (status: string) => {
+    switch (status) {
+      case 'active':
+      case 'approved':
+      case 'success':
+        return {
+          background: 'linear-gradient(135deg, #4caf50, #388e3c)',
+          color: 'white',
+          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
+        };
+      case 'inactive':
+      case 'rejected':
+      case 'error':
+        return {
+          background: 'linear-gradient(135deg, #f44336, #d32f2f)',
+          color: 'white',
+          boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
+        };
+      case 'pending':
+      case 'warning':
+        return {
+          background: 'linear-gradient(135deg, #ff9800, #f57c00)',
+          color: 'white',
+          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
+        };
+      case 'info':
+        return {
+          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
+          color: 'white',
+          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
+        };
+      default:
+        return {
+          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
+          color: 'white',
+          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
+        };
+    }
+  };
+
+  const statusConfig = getStatusConfig(status);
+
+  return (
+    <Chip
+      {...props}
+      sx={{
+        fontWeight: 600,
+        fontSize: '0.75rem',
+        height: 28,
+        borderRadius: 2,
+        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
+        textTransform: 'uppercase',
+        letterSpacing: 0.5,
+        ...statusConfig,
+        ...(pulse && {
+          animation: 'pulse 2s infinite',
+        }),
+        '&:hover': {
+          transform: 'translateY(-2px) scale(1.05)',
+          boxShadow: statusConfig.boxShadow.replace('0.3)', '0.5)'),
+        },
+        ...sx,
+      }}
+    />
+  );
+};
+
+export default StatusBadge;
+