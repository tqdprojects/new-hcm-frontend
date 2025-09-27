import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import {
  BeachAccess,
  LocalHospital,
  Home,
  Work,
  BabyChangingStation as Baby,
  Person,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLeaveBalance, useLeaveTypes } from '../../hooks/useLeaves';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const leaveTypeIcons: Record<string, React.ComponentType> = {
  'AL': BeachAccess,
  'SL': LocalHospital,
  'CL': Home,
  'WFH': Work,
  'ML': Baby,
  'PL': Person,
};

const leaveTypeColors: Record<string, string> = {
  'AL': 'primary',
  'SL': 'error',
  'CL': 'info',
  'WFH': 'success',
  'ML': 'secondary',
  'PL': 'warning',
};

export default function LeaveBalance() {
  const navigate = useNavigate();
  const { employee } = useAuthStore();
  const currentYear = new Date().getFullYear();

  const { data: leaveBalanceResponse, isLoading } = useLeaveBalance(employee?._id || '', currentYear);
  const { data: leaveTypesResponse } = useLeaveTypes();

  const leaveBalances = leaveBalanceResponse?.data || {};
  const leaveTypes = leaveTypesResponse?.data || [];

  if (isLoading) {
    return <LoadingSpinner message="Loading leave balances..." />;
  }

  const totalAllocated = Object.values(leaveBalances).reduce((sum: number, balance: any) => sum + balance.allocated, 0);
  const totalUsed = Object.values(leaveBalances).reduce((sum: number, balance: any) => sum + balance.used, 0);
  const totalAvailable = Object.values(leaveBalances).reduce((sum: number, balance: any) => sum + balance.available, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Leave Balance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your leave entitlements and usage for {currentYear}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          onClick={() => navigate('/leaves/apply')}
        >
          Apply for Leave
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BeachAccess />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    {totalAllocated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Allocated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <TrendingDown />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600} color="error.main">
                    {totalUsed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Used
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600} color="success.main">
                    {totalAvailable}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Available
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Balance Cards */}
      <Grid container spacing={3}>
        {leaveTypes.map((leaveType) => {
          const balance = leaveBalances[leaveType.code];
          const IconComponent = leaveTypeIcons[leaveType.code] || BeachAccess;
          const color = leaveTypeColors[leaveType.code] || 'primary';
          
          if (!balance) return null;

          const usagePercentage = balance.allocated > 0 ? (balance.used / balance.allocated) * 100 : 0;

          return (
            <Grid item xs={12} md={6} lg={4} key={leaveType._id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${color}.main` }}>
                      <IconComponent />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {leaveType.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {leaveType.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Usage: {balance.used} / {balance.allocated} days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(usagePercentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={usagePercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: usagePercentage > 80 ? 'error.main' : 
                                   usagePercentage > 60 ? 'warning.main' : 'success.main',
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={600} color="success.main">
                          {balance.available}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Available
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={600} color="warning.main">
                          {balance.pending}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pending
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {balance.carriedForward > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`${balance.carriedForward} days carried forward`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Leave Policy Information */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Leave Policy Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Leave Year"
                secondary={`January 1, ${currentYear} - December 31, ${currentYear}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Carry Forward Policy"
                secondary="Unused annual leave can be carried forward to the next year (maximum 5 days)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Leave Encashment"
                secondary="Unused leave can be encashed at the end of the year as per company policy"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Probation Period"
                secondary="Leave eligibility starts after completion of probation period"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}