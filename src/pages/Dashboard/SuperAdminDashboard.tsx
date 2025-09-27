import React from 'react';
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
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  People,
  AttachMoney,
  Speed,
  Security,
  CloudQueue,
  Analytics,
  Warning,
  CheckCircle,
  Error,
  MoreVert,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Box component="div" sx={{ fontSize: '2.125rem', fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {change > 0 ? (
              <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} fontSize="small" />
            )}
            <Typography
              variant="body2"
              sx={{
                color: change > 0 ? 'success.main' : 'error.main',
                fontWeight: 500,
              }}
            >
              {Math.abs(change)}% from last month
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const SuperAdminDashboard: React.FC = () => {
  const platformMetrics = [
    {
      title: 'Active Tenants',
      value: 247,
      change: 12.5,
      icon: Business,
      color: 'primary' as const,
    },
    {
      title: 'Total Users',
      value: '45.2K',
      change: 8.3,
      icon: People,
      color: 'secondary' as const,
    },
    {
      title: 'Monthly Revenue',
      value: '$892K',
      change: 15.7,
      icon: AttachMoney,
      color: 'success' as const,
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: 0.2,
      icon: Speed,
      color: 'warning' as const,
    },
  ];

  const recentTenants = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      plan: 'Enterprise',
      users: 1250,
      status: 'active',
      revenue: '$12,500',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Global Industries',
      plan: 'Professional',
      users: 850,
      status: 'active',
      revenue: '$8,500',
      joinDate: '2024-01-12',
    },
    {
      id: 3,
      name: 'StartupHub Inc',
      plan: 'Starter',
      users: 125,
      status: 'trial',
      revenue: '$0',
      joinDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'Manufacturing Co',
      plan: 'Enterprise',
      users: 2100,
      status: 'active',
      revenue: '$21,000',
      joinDate: '2024-01-08',
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High CPU usage detected on Server Cluster 3',
      timestamp: '2 minutes ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '1 hour ago',
    },
    {
      id: 3,
      type: 'error',
      message: 'Payment processing failed for TechCorp Solutions',
      timestamp: '3 hours ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trial':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Error sx={{ color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      default:
        return <CheckCircle sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Platform Overview
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {platformMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Tenants */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Tenants
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Organization</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {tenant.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {tenant.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Joined {tenant.joinDate}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tenant.plan}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{tenant.users.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={tenant.status}
                            size="small"
                            color={getStatusColor(tenant.status) as any}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {tenant.revenue}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVert />
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

        {/* System Status & Alerts */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* System Health */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    System Health
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2">68%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={68} sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2">45%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage Usage</Typography>
                      <Typography variant="body2">72%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={72} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudQueue sx={{ color: 'primary.main', mb: 1 }} />
                      <Typography variant="caption" display="block">
                        Cloud Services
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Healthy
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Security sx={{ color: 'primary.main', mb: 1 }} />
                      <Typography variant="caption" display="block">
                        Security
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Secure
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* System Alerts */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    System Alerts
                  </Typography>
                  <Box>
                    {systemAlerts.map((alert) => (
                      <Box
                        key={alert.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          mb: 2,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Box sx={{ mr: 2, mt: 0.5 }}>
                          {getAlertIcon(alert.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {alert.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Button variant="text" size="small" sx={{ mt: 1 }}>
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};