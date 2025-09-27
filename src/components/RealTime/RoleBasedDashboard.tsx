import React from 'react';
import { Box, Alert } from '@mui/material';
import { useAuthStore } from '../../stores/authStore';
import { Dashboard } from '../../pages/Dashboard/index';
import { useRealTimeNotifications } from '../../hooks/useRealTimeNotifications';
import { useRealTimeData } from '../../hooks/useRealTimeData';

export default function RoleBasedDashboard() {
  const { user, isAuthenticated } = useAuthStore();

  // Initialize real-time features for all roles
  useRealTimeNotifications();
  
  // Role-specific real-time data
  const { isConnected } = useRealTimeData({
    queryKeys: [['dashboard-data', user?.role]],
    events: [
      'dashboard:update',
      'metrics:update',
      'workflow:update',
      'notification:new'
    ],
    enabled: isAuthenticated && !!user,
  });

  if (!isAuthenticated || !user) {
    return (
      <Alert severity="error">
        Authentication required. Please log in to access the dashboard.
      </Alert>
    );
  }


  return (
    <Box>
      {/* Connection status indicator for admins */}
      {['super-admin', 'tenant-admin'].includes(user.role) && (
        <Box sx={{ mb: 2 }}>
          <Alert 
            severity={isConnected ? 'success' : 'warning'}
            sx={{ 
              '& .MuiAlert-message': { 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              } 
            }}
          >
            Real-time monitoring: {isConnected ? 'Connected' : 'Disconnected'}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isConnected ? 'success.main' : 'error.main',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
          </Alert>
        </Box>
      )}
      
      <Dashboard />
    </Box>
  );
}