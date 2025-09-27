import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  AttachMoney,
  People,
  Analytics,
  Download,
  Refresh,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';

export default function PlatformAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metricType, setMetricType] = useState('revenue');

  // Real-time platform metrics
  const { data: platformMetrics } = useRealTimeData({
    queryKeys: [['platform-metrics']],
    events: ['platform:metrics-update'],
    endpoint: '/super-admin/platform-metrics',
    params: { timeRange },
  });

  const tenantGrowthData = [
    { month: 'Jul', tenants: 180, revenue: 450000, users: 28500 },
    { month: 'Aug', tenants: 195, revenue: 487500, users: 31200 },
    { month: 'Sep', tenants: 210, revenue: 525000, users: 33800 },
    { month: 'Oct', tenants: 225, revenue: 562500, users: 36500 },
    { month: 'Nov', tenants: 240, revenue: 600000, users: 39200 },
    { month: 'Dec', tenants: 247, revenue: 617500, users: 42100 },
  ];

  const tenantDistribution = [
    { plan: 'Enterprise', count: 45, revenue: 450000, color: '#1976d2' },
    { plan: 'Professional', count: 120, revenue: 180000, color: '#00796b' },
    { plan: 'Starter', count: 82, revenue: 41000, color: '#388e3c' },
  ];

  const topTenants = [
    { name: 'TechCorp Solutions', employees: 2500, revenue: 62500, growth: 15.2 },
    { name: 'Global Industries', employees: 1800, revenue: 45000, growth: 8.7 },
    { name: 'Innovation Labs', employees: 1200, revenue: 30000, growth: 22.1 },
    { name: 'Digital Dynamics', employees: 950, revenue: 23750, growth: 12.3 },
    { name: 'Future Systems', employees: 800, revenue: 20000, growth: 18.9 },
  ];

  const systemHealth = {
    uptime: 99.8,
    responseTime: 145,
    errorRate: 0.02,
    throughput: 15420,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Platform Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analytics across all tenants and users
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh Data
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="90d">Last 90 Days</MenuItem>
                  <MenuItem value="1y">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Metric Type</InputLabel>
                <Select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value)}
                  label="Metric Type"
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="users">Users</MenuItem>
                  <MenuItem value="tenants">Tenants</MenuItem>
                  <MenuItem value="usage">Usage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    247
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Tenants
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +12.5% this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    $892K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +18.7% this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    42.1K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +8.3% this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    99.8%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System Uptime
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +0.2% this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Platform Growth Trends
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tenantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="tenants"
                      stroke="#1976d2"
                      strokeWidth={3}
                      name="Tenants"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00796b"
                      strokeWidth={3}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Subscription Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tenantDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="count"
                      label={({ plan, percent }) => `${plan} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tenantDistribution.map((entry, index) => (
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
      </Grid>

      {/* Top Tenants */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Performing Tenants
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Organization</TableCell>
                      <TableCell align="right">Employees</TableCell>
                      <TableCell align="right">Monthly Revenue</TableCell>
                      <TableCell align="right">Growth Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topTenants.map((tenant, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {tenant.name.charAt(0)}
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {tenant.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {tenant.employees.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${tenant.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`+${tenant.growth}%`}
                            size="small"
                            color="success"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                System Health
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Uptime</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {systemHealth.uptime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={systemHealth.uptime}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Avg Response Time
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {systemHealth.responseTime}ms
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Error Rate
                </Typography>
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {systemHealth.errorRate}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Requests/Hour
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {systemHealth.throughput.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}