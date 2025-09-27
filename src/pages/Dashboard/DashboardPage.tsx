import React from 'react';
import { Box } from '@mui/material';
import { Dashboard } from './index';
import LiveAttendanceWidget from '../../components/RealTime/LiveAttendanceWidget';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <Box>
      {/* Live Attendance Widget for employees */}
      {user?.role === 'employee' && (
        <Box sx={{ mb: 3 }}>
          <LiveAttendanceWidget />
        </Box>
      )}
      
      <Dashboard />
    </Box>
  );
}