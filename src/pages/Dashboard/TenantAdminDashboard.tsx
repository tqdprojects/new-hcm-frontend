import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Assignment,
  AttachMoney,
  Schedule,
  CheckCircle,
  Warning,
  Settings,
  Analytics,
  PersonAdd,
  Business,
  Security,
  Notifications,
  MoreVert,
  Psychology,
  Add,
  Edit,
  Visibility,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MetricCard from '../../components/Dashboard/MetricCard';
import { useNotificationStore } from '../../stores/notificationStore';

export const TenantAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [configDialog, setConfigDialog] = useState(false);

  const adminMetrics = [
    {
      title: 'Total Employees',
      value: '1,247',
      change: 12.5,
      changeType: 'increase' as const,
      icon: People,
      color: 'primary' as const,
    },
    {
      title: 'Active Users',
      value: '1,189',
      change: 8.3,
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'success' as const,
    },
    {
      title: 'Monthly Payroll',
      value: '$2.1M',
      change: 5.7,
      changeType: 'increase' as const,
      icon: AttachMoney,
      color: 'secondary' as const,
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: 0.2,
      changeType: 'percentage' as const,
      icon: Analytics,
      color: 'info' as const,
    },
  ];

  const departmentData = [
    { department: 'Engineering', employees: 456, budget: 1200000, utilization: 85 },
    { department: 'Sales', employees: 234, budget: 800000, utilization: 78 },
    { department: 'Marketing', employees: 123, budget: 500000, utilization: 92 },
    { department: 'HR', employees: 89, budget: 300000, utilization: 67 },
    { department: 'Operations', employees: 167, budget: 400000, utilization: 73 },
    { department: 'Finance', employees: 78, budget: 250000, utilization: 88 },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'Security',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      severity: 'warning',
      timestamp: '2024-01-15T10:30:00Z',
      action: 'Block IP',
    },
    {
      id: 2,
      type: 'Performance',
      message: 'Database query response time increased by 15%',
      severity: 'info',
      timestamp: '2024-01-15T09:45:00Z',
      action: 'Optimize',
    },
    {
      id: 3,
      type: 'Compliance',
      message: 'Monthly compliance report due in 3 days',
      severity: 'warning',
      timestamp: '2024-01-15T08:00:00Z',
      action: 'Generate Report',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'Created new employee record',
      target: 'John Smith (EMP001)',
      timestamp: '2024-01-15T11:30:00Z',
      type: 'employee',
    },
    {
      id: 2,
      user: 'Mike Davis',
      action: 'Processed payroll',
      target: 'Engineering Department',
      timestamp: '2024-01-15T10:15:00Z',
      type: 'payroll',
    },
    {
      id: 3,
      user: 'Lisa Chen',
      action: 'Updated system configuration',
      target: 'Leave Policies',
      timestamp: '2024-01-15T09:45:00Z',
      type: 'config',
    },
    {
      id: 4,
      user: 'Admin System',
      action: 'Automated backup completed',
      target: 'Database Backup',
      timestamp: '2024-01-15T02:00:00Z',
      type: 'system',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Leave Request',
      employee: 'Alice Wilson',
      details: '5 days vacation leave',
      priority: 'medium',
      daysWaiting: 2,
    },
    {
      id: 2,
      type: 'Expense Claim',
      employee: 'Bob Johnson',
      details: '$1,250 travel expenses',
      priority: 'high',
      daysWaiting: 5,
    },
    {
      id: 3,
      type: 'Performance Review',
      employee: 'Carol Smith',
      details: 'Q4 performance evaluation',
      priority: 'medium',
      daysWaiting: 3,
    },
  ];

  const usageStats = [
    { module: 'Employee Management', usage: 95, users: 234 },
    { module: 'Payroll', usage: 88, users: 45 },
    { module: 'Time & Attendance', usage: 92, users: 1189 },
    { module: 'Performance', usage: 76, users: 567 },
    { module: 'Recruitment', usage: 65, users: 23 },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-employee':
        navigate('/employees/add');
        break;
      case 'system-config':
        navigate('/configuration');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'user-management':
        navigate('/users');
        break;
      default:
        addNotification({
          title: 'Action Triggered',
          message: `${action} action has been triggered`,
          type: 'info'
        });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'error':
        return <Warning sx={{ color: 'error.main' }} />;
      default:
        return <CheckCircle sx={{ color: 'info.main' }} />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <PersonAdd />;
      case 'payroll':
        return <AttachMoney />;
      case 'config':
        return <Settings />;
      case 'system':
        return <Analytics />;
      default:
        return <Assignment />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            onClick={() => navigate('/reports')}
          >
            System Reports
          </Button>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => setConfigDialog(true)}
          >
            System Config
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Department Overview */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Department Overview
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/departments')}
                >
                  Manage Departments
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Employees</TableCell>
                      <TableCell align="right">Budget</TableCell>
                      <TableCell align="right">Utilization</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentData.map((dept) => (
                      <TableRow key={dept.department} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {dept.department}
                        </TableCell>
                        <TableCell align="right">{dept.employees}</TableCell>
                        <TableCell align="right">
                          ${(dept.budget / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={dept.utilization}
                              sx={{ width: 60, height: 6 }}
                            />
                            <Typography variant="body2">
                              {dept.utilization}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/departments/${dept.department.toLowerCase()}`)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/departments/${dept.department.toLowerCase()}/edit`)}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  System Alerts
                </Typography>
              </Box>
              <List>
                {systemAlerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          {getSeverityIcon(alert.severity)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {alert.type}
                            </Typography>
                            <Button size="small" variant="outlined">
                              {alert.action}
                            </Button>
                          </Box>
                        }
                        secondary={alert.message}
                      />
                    </ListItem>
                    {index < systemAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button 
                variant="text" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => navigate('/system/alerts')}
              >
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Module Usage Statistics */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Module Usage Statistics
              </Typography>
              <List>
                {usageStats.map((stat, index) => (
                  <React.Fragment key={stat.module}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {stat.module}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {stat.users} users
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={stat.usage}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {stat.usage}% utilization
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < usageStats.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Pending Approvals
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/approvals')}
                >
                  View All
                </Button>
              </Box>
              <List>
                {pendingApprovals.map((approval, index) => (
                  <React.Fragment key={approval.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={approval.priority}
                            size="small"
                            color={getPriorityColor(approval.priority) as any}
                          />
                          <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            {approval.daysWaiting}d
                          </Box>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {approval.type}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {approval.employee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {approval.details}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingApprovals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent System Activities
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<Download />}
                  onClick={() => {
                    addNotification({
                      title: 'Export Started',
                      message: 'Activity log export has been initiated',
                      type: 'info'
                    });
                  }}
                >
                  Export Log
                </Button>
              </Box>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {activity.user}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.action}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.primary">
                              {activity.target}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(activity.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => handleQuickAction('add-employee')}
                    sx={{ py: 2 }}
                  >
                    Add Employee
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={() => handleQuickAction('system-config')}
                    sx={{ py: 2 }}
                  >
                    System Config
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Analytics />}
                    onClick={() => handleQuickAction('reports')}
                    sx={{ py: 2 }}
                  >
                    Generate Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => handleQuickAction('user-management')}
                    sx={{ py: 2 }}
                  >
                    User Management
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Dialog */}
      <Dialog
        open={configDialog}
        onClose={() => setConfigDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>System Configuration</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Default Language</InputLabel>
                <Select label="Default Language" defaultValue="en">
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Time Zone</InputLabel>
                <Select label="Time Zone" defaultValue="UTC">
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">Eastern Time</MenuItem>
                  <MenuItem value="PST">Pacific Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                defaultValue="VibhoHCM Enterprise"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="System Maintenance Message"
                placeholder="Enter maintenance message for users..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setConfigDialog(false);
              addNotification({
                title: 'Configuration Updated',
                message: 'System configuration has been updated successfully',
                type: 'success'
              });
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};