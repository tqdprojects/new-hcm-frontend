import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface EnhancedButtonProps extends ButtonProps {
+  loading?: boolean;
+  gradient?: boolean;
+  glow?: boolean;
+  pulse?: boolean;
+}
+
+const EnhancedButton: React.FC<EnhancedButtonProps> = ({
+  children,
+  loading = false,
+  gradient = false,
+  glow = false,
+  pulse = false,
+  disabled,
+  sx,
+  ...props
+}) => {
+  return (
+    <Button
+      {...props}
+      disabled={disabled || loading}
+      sx={{
+        position: 'relative',
+        overflow: 'hidden',
+        textTransform: 'none',
+        fontWeight: 600,
+        borderRadius: 2,
+        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
+        ...(gradient && {
+          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
+          color: 'white',
+          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
+          '&:hover': {
+            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #01579b 100%)',
+            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
+            transform: 'translateY(-3px)',
+          },
+        }),
+        ...(glow && {
+          boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)',
+          '&:hover': {
+            boxShadow: '0 0 30px rgba(25, 118, 210, 0.5)',
+          },
+        }),
+        ...(pulse && {
+          animation: 'pulse 2s infinite',
+        }),
+        '&::before': {
+          content: '""',
+          position: 'absolute',
+          top: 0,
+          left: '-100%',
+          width: '100%',
+          height: '100%',
+          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
+          transition: 'left 0.6s ease',
+        },
+        '&:hover::before': {
+          left: '100%',
+        },
+        '&:active': {
+          transform: 'translateY(-1px)',
+        },
+        ...sx,
+      }}
+    >
+      {loading && (
+        <CircularProgress
+          size={20}
+          sx={{
+            color: 'inherit',
+            mr: 1,
+          }}
+        />
+      )}
+      {children}
+    </Button>
+  );
+};
+
+export default EnhancedButton;
+