import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
} from '@mui/material';
import {
  People,
  Business,
  AttachMoney,
  TrendingUp,
  Warning,
  CheckCircle,
  Settings,
  Assessment,
  Notifications,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../../components/Dashboard/MetricCard';
import QuickActionCard from '../../components/Dashboard/QuickActionCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const metrics = [
    {
      title: 'Total Employees',
      value: '2,847',
      change: 3.2,
      changeType: 'increase' as const,
      icon: People,
      color: 'primary' as const,
    },
    {
      title: 'Active Branches',
      value: '12',
      subtitle: 'Across 8 Cities',
      icon: Business,
      color: 'info' as const,
    },
    {
      title: 'Monthly Payroll',
      value: '$2.4M',
      change: 2.1,
      changeType: 'increase' as const,
      icon: AttachMoney,
      color: 'success' as const,
    },
    {
      title: 'System Health',
      value: '99.9%',
      subtitle: 'Uptime',
      icon: TrendingUp,
      color: 'success' as const,
    },
  ];

  const quickActions = [
    {
      title: 'System Configuration',
      description: 'Manage system settings',
      icon: Settings,
      color: 'primary' as const,
      onClick: () => navigate('/configuration'),
    },
    {
      title: 'User Management',
      description: 'Manage user roles & permissions',
      icon: People,
      color: 'secondary' as const,
      onClick: () => navigate('/configuration/users'),
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed analytics',
      icon: Assessment,
      color: 'info' as const,
      onClick: () => navigate('/reports/analytics'),
    },
    {
      title: 'Security Center',
      description: 'Monitor security events',
      icon: Security,
      color: 'warning' as const,
      onClick: () => navigate('/configuration/security'),
    },
  ];

  const growthData = [
    { month: 'Jan', employees: 2650, revenue: 2200000 },
    { month: 'Feb', employees: 2680, revenue: 2250000 },
    { month: 'Mar', employees: 2720, revenue: 2300000 },
    { month: 'Apr', employees: 2750, revenue: 2320000 },
    { month: 'May', employees: 2780, revenue: 2350000 },
    { month: 'Jun', employees: 2810, revenue: 2380000 },
    { month: 'Jul', employees: 2847, revenue: 2400000 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 840, color: '#1976d2' },
    { name: 'Sales', value: 520, color: '#00796b' },
    { name: 'Marketing', value: 280, color: '#388e3c' },
    { name: 'HR', value: 120, color: '#f57c00' },
    { name: 'Finance', value: 95, color: '#d32f2f' },
    { name: 'Operations', value: 180, color: '#7b1fa2' },
  ];

  const systemAlerts = [
    {
      type: 'Security',
      message: 'Failed login attempts detected from unusual locations',
      severity: 'high',
      time: '5 minutes ago',
      action: 'Review Security Logs'
    },
    {
      type: 'Performance',
      message: 'Database query performance degraded by 15%',
      severity: 'medium',
      time: '1 hour ago',
      action: 'Optimize Queries'
    },
    {
      type: 'Backup',
      message: 'Daily backup completed successfully',
      severity: 'low',
      time: '2 hours ago',
      action: 'View Backup Status'
    },
    {
      type: 'Integration',
      message: 'WhatsApp API rate limit approaching',
      severity: 'medium',
      time: '3 hours ago',
      action: 'Check API Usage'
    },
  ];

  const recentActivities = [
    {
      title: 'New tenant registered',
      description: 'Acme Corp - 500 employees',
      time: '10 minutes ago',
      icon: Business,
      type: 'success' as const,
    },
    {
      title: 'Payroll processed',
      description: 'December 2024 - 2,847 employees',
      time: '2 hours ago',
      icon: AttachMoney,
      type: 'success' as const,
    },
    {
      title: 'System maintenance',
      description: 'Database optimization completed',
      time: '4 hours ago',
      icon: Settings,
      type: 'info' as const,
    },
    {
      title: 'Security alert resolved',
      description: 'Suspicious login activity blocked',
      time: '6 hours ago',
      icon: Security,
      type: 'warning' as const,
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Growth Trends */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Growth Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'employees' ? value : `$${(value as number).toLocaleString()}`,
                      name === 'employees' ? 'Employees' : 'Revenue'
                    ]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="employees"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00796b"
                    strokeWidth={3}
                    dot={{ fill: '#00796b', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Distribution */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Department Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* System Alerts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                System Alerts
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/configuration/alerts')}
              >
                View All
              </Button>
            </Box>
            
            <List>
              {systemAlerts.map((alert, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: alert.severity === 'high' ? 'error.main' :
                                alert.severity === 'medium' ? 'warning.main' : 'info.main',
                        width: 32,
                        height: 32,
                      }}
                    >
                      {alert.type === 'Security' && <Security sx={{ fontSize: 18 }} />}
                      {alert.type === 'Performance' && <TrendingUp sx={{ fontSize: 18 }} />}
                      {alert.type === 'Backup' && <CheckCircle sx={{ fontSize: 18 }} />}
                      {alert.type === 'Integration' && <Notifications sx={{ fontSize: 18 }} />}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {alert.type}
                        </Typography>
                        <Chip
                          label={alert.severity}
                          size="small"
                          color={
                            alert.severity === 'high' ? 'error' :
                            alert.severity === 'medium' ? 'warning' : 'info'
                          }
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {alert.time} • {alert.action}
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

      {/* Recent Activities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent System Activities
            </Typography>
            
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        bgcolor: activity.type === 'success' ? 'success.main' :
                                 activity.type === 'warning' ? 'warning.main' :
                                 activity.type === 'error' ? 'error.main' : 'info.main',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <activity.icon sx={{ fontSize: 18 }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={500}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {activity.time}
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
  );
}