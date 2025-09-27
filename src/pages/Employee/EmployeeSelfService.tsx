import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Person,
  BeachAccess,
  AccessTime,
  Star,
  Receipt,
  Description,
  CheckCircle,
  Schedule,
  Warning,
  Assignment,
  AttachMoney,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useNavigate } from 'react-router-dom';

export default function EmployeeSelfService() {
  const navigate = useNavigate();
  const { user, employee } = useAuthStore();
  const [requestDialog, setRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [requestDetails, setRequestDetails] = useState('');

  // Real-time employee data
  const { data: employeeData } = useRealTimeData({
    queryKeys: [['employee-dashboard', employee?._id]],
    events: ['employee:update', 'attendance:update', 'leave:update'],
    endpoint: `/employee/dashboard/${employee?._id}`,
  });

  const quickActions = [
    {
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      icon: BeachAccess,
      color: 'primary',
      action: () => navigate('/leaves/apply'),
    },
    {
      title: 'Check Attendance',
      description: 'View attendance history',
      icon: AccessTime,
      color: 'success',
      action: () => navigate('/attendance/history'),
    },
    {
      title: 'Submit Expense',
      description: 'Submit expense claim',
      icon: Receipt,
      color: 'warning',
      action: () => navigate('/claims/submit'),
    },
    {
      title: 'View Payslip',
      description: 'Download latest payslip',
      icon: AttachMoney,
      color: 'info',
      action: () => navigate('/payroll/payslips'),
    },
    {
      title: 'Update Profile',
      description: 'Edit personal information',
      icon: Person,
      color: 'secondary',
      action: () => navigate('/profile'),
    },
    {
      title: 'View Goals',
      description: 'Track performance goals',
      icon: Assignment,
      color: 'error',
      action: () => navigate('/performance/goals'),
    },
  ];

  const recentActivities = [
    {
      type: 'Attendance',
      action: 'Checked in',
      details: 'Started work at 9:15 AM',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      type: 'Leave',
      action: 'Leave approved',
      details: 'Annual leave for Dec 25-26',
      timestamp: '1 day ago',
      status: 'success',
    },
    {
      type: 'Performance',
      action: 'Goal updated',
      details: 'React training progress: 75%',
      timestamp: '2 days ago',
      status: 'info',
    },
    {
      type: 'Expense',
      action: 'Claim submitted',
      details: 'Travel expenses - $180',
      timestamp: '3 days ago',
      status: 'warning',
    },
  ];

  const pendingTasks = [
    {
      title: 'Complete Performance Self-Review',
      dueDate: '2024-12-20',
      priority: 'high',
      description: 'Annual performance review due',
    },
    {
      title: 'Update Emergency Contacts',
      dueDate: '2024-12-31',
      priority: 'medium',
      description: 'HR requested contact update',
    },
    {
      title: 'Submit Training Certificates',
      dueDate: '2025-01-15',
      priority: 'low',
      description: 'Upload completed training certificates',
    },
  ];

  const employeeStats = {
    leaveBalance: 18,
    attendanceRate: 96.8,
    performanceScore: 4.2,
    goalsCompleted: 8,
    totalGoals: 10,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Attendance': return <AccessTime />;
      case 'Leave': return <BeachAccess />;
      case 'Performance': return <Star />;
      case 'Expense': return <Receipt />;
      default: return <Assignment />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      default: return 'info.main';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Employee Self-Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your work life with easy self-service tools
        </Typography>
      </Box>

      {/* Employee Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {employeeStats.leaveBalance}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Leave Days Left
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {employeeStats.attendanceRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="secondary.main">
                {employeeStats.performanceScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {employeeStats.goalsCompleted}/{employeeStats.totalGoals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goals Completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(employeeStats.goalsCompleted / employeeStats.totalGoals) * 100}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Assignment />}
                onClick={() => {
                  setRequestType('general');
                  setRequestDialog(true);
                }}
              >
                Submit Request
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                HR requests & queries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${action.color}.main` }}>
                        <action.icon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getActivityColor(activity.status) }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary">
                            {activity.details}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pending Tasks
              </Typography>
              <List>
                {pendingTasks.map((task, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getPriorityColor(task.priority) + '.main' }}>
                        <Assignment />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {task.title}
                          </Typography>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {task.dueDate}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Request Dialog */}
      <Dialog
        open={requestDialog}
        onClose={() => setRequestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Submit HR Request
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Request Subject"
                placeholder="Brief description of your request..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Request Details"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Provide detailed information about your request..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('Submitting HR request:', requestDetails);
              setRequestDialog(false);
              setRequestDetails('');
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}