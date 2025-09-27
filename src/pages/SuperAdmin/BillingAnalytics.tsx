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
  AttachMoney,
  TrendingUp,
  TrendingDown,
  People,
  Assessment,
  Download,
  Business,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useRevenueAnalytics, usePlanAnalytics } from '../../hooks/useSubscriptions';

export default function BillingAnalytics() {
  const [timeRange, setTimeRange] = useState('12m');
  const [metricType, setMetricType] = useState('revenue');

  const { data: revenueData } = useRevenueAnalytics(timeRange);
  const { data: planAnalytics } = usePlanAnalytics();

  const revenueGrowthData = [
    { month: 'Jan', revenue: 650000, subscriptions: 180, churn: 2.1 },
    { month: 'Feb', revenue: 687500, subscriptions: 195, churn: 1.8 },
    { month: 'Mar', revenue: 725000, subscriptions: 210, churn: 1.5 },
    { month: 'Apr', revenue: 762500, subscriptions: 225, churn: 1.9 },
    { month: 'May', revenue: 800000, subscriptions: 240, churn: 1.6 },
    { month: 'Jun', revenue: 837500, subscriptions: 255, churn: 1.4 },
    { month: 'Jul', revenue: 875000, subscriptions: 270, churn: 1.7 },
    { month: 'Aug', revenue: 912500, subscriptions: 285, churn: 1.3 },
    { month: 'Sep', revenue: 950000, subscriptions: 300, churn: 1.5 },
    { month: 'Oct', revenue: 987500, subscriptions: 315, churn: 1.2 },
    { month: 'Nov', revenue: 1025000, subscriptions: 330, churn: 1.4 },
    { month: 'Dec', revenue: 1062500, subscriptions: 345, churn: 1.1 },
  ];

  const planDistribution = [
    { plan: 'Enterprise', subscriptions: 45, revenue: 562500, color: '#1976d2' },
    { plan: 'Professional', subscriptions: 180, revenue: 360000, color: '#00796b' },
    { plan: 'Starter', subscriptions: 120, revenue: 120000, color: '#388e3c' },
  ];

  const topPerformingPlans = [
    { plan: 'Enterprise Plus', subscriptions: 25, revenue: 312500, growth: 22.5 },
    { plan: 'Professional', subscriptions: 180, revenue: 360000, growth: 18.3 },
    { plan: 'Enterprise', subscriptions: 20, revenue: 250000, growth: 15.7 },
    { plan: 'Starter Pro', subscriptions: 95, revenue: 142500, growth: 12.1 },
    { plan: 'Starter', subscriptions: 25, revenue: 37500, growth: 8.9 },
  ];

  const billingMetrics = {
    totalRevenue: 1062500,
    monthlyGrowth: 15.7,
    averageRevenuePerUser: 3080,
    churnRate: 1.1,
    lifetimeValue: 24640,
    conversionRate: 23.5,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Billing & Revenue Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive billing analytics and revenue insights
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Download />}
        >
          Export Report
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="primary.main">
                ${(billingMetrics.totalRevenue / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="caption" color="success.main">
                +{billingMetrics.monthlyGrowth}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="success.main">
                ${billingMetrics.averageRevenuePerUser.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ARPU
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="error.main">
                {billingMetrics.churnRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Churn Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="secondary.main">
                ${billingMetrics.lifetimeValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                LTV
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="info.main">
                {billingMetrics.conversionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conversion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="warning.main">
                345
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Subscriptions
              </Typography>
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
                Revenue Growth Trend
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${(value as number).toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 
                        name === 'subscriptions' ? 'Subscriptions' : 'Churn Rate (%)'
                      ]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1976d2"
                      strokeWidth={3}
                      name="revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="subscriptions"
                      stroke="#00796b"
                      strokeWidth={3}
                      name="subscriptions"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="churn"
                      stroke="#f44336"
                      strokeWidth={2}
                      name="churn"
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
                Plan Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="subscriptions"
                      label={({ plan, percent }) => `${plan} ${(percent * 100).toFixed(0)}%`}
                    >
                      {planDistribution.map((entry, index) => (
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

      {/* Top Performing Plans */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Top Performing Plans
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan Name</TableCell>
                  <TableCell align="right">Subscriptions</TableCell>
                  <TableCell align="right">Monthly Revenue</TableCell>
                  <TableCell align="right">Growth Rate</TableCell>
                  <TableCell align="center">Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPerformingPlans.map((plan, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {plan.plan.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {plan.plan}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {plan.subscriptions}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${plan.revenue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        {plan.growth > 0 ? (
                          <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                        )}
                        <Typography 
                          variant="body2" 
                          color={plan.growth > 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {plan.growth > 0 ? '+' : ''}{plan.growth}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <LinearProgress
                        variant="determinate"
                        value={plan.growth > 0 ? Math.min(plan.growth * 4, 100) : 0}
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}