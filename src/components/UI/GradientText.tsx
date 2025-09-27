import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface GradientTextProps extends TypographyProps {
+  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
+}
+
+const GradientText: React.FC<GradientTextProps> = ({
+  children,
+  gradient = 'primary',
+  sx,
+  ...props
+}) => {
+  const getGradient = (type: string) => {
+    switch (type) {
+      case 'primary':
+        return 'linear-gradient(135deg, #1976d2, #00796b)';
+      case 'secondary':
+        return 'linear-gradient(135deg, #00796b, #004d40)';
+      case 'success':
+        return 'linear-gradient(135deg, #4caf50, #2e7d32)';
+      case 'warning':
+        return 'linear-gradient(135deg, #ff9800, #f57c00)';
+      case 'error':
+        return 'linear-gradient(135deg, #f44336, #d32f2f)';
+      case 'info':
+        return 'linear-gradient(135deg, #2196f3, #1976d2)';
+      default:
+        return type; // Custom gradient string
+    }
+  };
+
+  return (
+    <Typography
+      {...props}
+      sx={{
+        background: getGradient(gradient),
+        WebkitBackgroundClip: 'text',
+        WebkitTextFillColor: 'transparent',
+        backgroundClip: 'text',
+        fontWeight: 700,
+        ...sx,
+      }}
+    >
+      {children}
+    </Typography>
+  );
+};
+
+export default GradientText;
+