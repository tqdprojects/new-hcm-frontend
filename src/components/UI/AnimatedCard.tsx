import React from 'react';
import { Card, CardProps, Fade, Grow } from '@mui/material';

interface AnimatedCardProps extends CardProps {
+  animation?: 'fade' | 'grow' | 'slide';
+  delay?: number;
+  hover?: boolean;
+  glow?: boolean;
+}
+
+const AnimatedCard: React.FC<AnimatedCardProps> = ({
+  children,
+  animation = 'fade',
+  delay = 0,
+  hover = true,
+  glow = false,
+  sx,
+  ...props
+}) => {
+  const cardContent = (
+    <Card
+      {...props}
+      className="enterprise-card"
+      sx={{
+        background: 'rgba(255, 255, 255, 0.95)',
+        backdropFilter: 'blur(20px)',
+        border: '1px solid rgba(255, 255, 255, 0.2)',
+        borderRadius: 3,
+        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
+        position: 'relative',
+        overflow: 'hidden',
+        ...(hover && {
+          '&:hover': {
+            transform: 'translateY(-8px) scale(1.02)',
+            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
+            borderColor: 'rgba(25, 118, 210, 0.2)',
+          },
+        }),
+        ...(glow && {
+          boxShadow: '0 0 20px rgba(25, 118, 210, 0.15)',
+          '&:hover': {
+            boxShadow: '0 0 30px rgba(25, 118, 210, 0.25), 0 20px 40px rgba(0, 0, 0, 0.08)',
+          },
+        }),
+        '&::before': {
+          content: '""',
+          position: 'absolute',
+          top: 0,
+          left: 0,
+          right: 0,
+          height: '1px',
+          background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.3), transparent)',
+          opacity: 0,
+          transition: 'opacity 0.3s ease',
+        },
+        '&:hover::before': {
+          opacity: 1,
+        },
+        ...sx,
+      }}
+    >
+      {children}
+    </Card>
+  );
+
+  if (animation === 'grow') {
+    return (
+      <Grow in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
+        <div>{cardContent}</div>
+      </Grow>
+    );
+  }
+
+  return (
+    <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
+      <div>{cardContent}</div>
+    </Fade>
+  );
+};
+
+export default AnimatedCard;
+