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
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assessment,
  Download,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6months');
  const [department, setDepartment] = useState('');

  const employeeGrowthData = [
    { month: 'Jul', employees: 2650 },
    { month: 'Aug', employees: 2680 },
    { month: 'Sep', employees: 2720 },
    { month: 'Oct', employees: 2750 },
    { month: 'Nov', employees: 2780 },
    { month: 'Dec', employees: 2810 },
  ];

  const attendanceData = [
    { month: 'Jul', attendance: 94.2 },
    { month: 'Aug', attendance: 95.8 },
    { month: 'Sep', attendance: 93.5 },
    { month: 'Oct', attendance: 96.1 },
    { month: 'Nov', attendance: 94.8 },
    { month: 'Dec', attendance: 95.3 },
  ];

  const departmentInsights = [
    { department: 'Engineering', employees: 840, performance: 4.2 },
    { department: 'Sales', employees: 520, performance: 4.1 },
    { department: 'Marketing', employees: 280, performance: 4.0 },
    { department: 'HR', employees: 120, performance: 4.3 },
    { department: 'Finance', employees: 95, performance: 4.2 },
    { department: 'Operations', employees: 180, performance: 4.1 },
  ];

  const performanceMetrics = [
    { metric: 'Avg Performance', value: '4.2/5.0', color: 'success' },
    { metric: 'Goal Completion', value: '87%', color: 'info' },
    { metric: 'Reviews Complete', value: '156/180', color: 'secondary' },
  ];

  const keyMetrics = [
    { metric: 'Retention Rate', value: '94.2%', color: 'success' },
    { metric: 'Satisfaction', value: '4.1/5.0', color: 'info' },
    { metric: 'Productivity', value: '+12%', color: 'warning' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced analytics and business intelligence
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Download />}
        >
          Export Analytics
        </Button>
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
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                  <MenuItem value="2years">Last 2 Years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Employee Growth Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="employees"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Attendance Analytics
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                    <Bar dataKey="attendance" fill="#00796b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Department Insights
              </Typography>
              <List>
                {departmentInsights.map((dept, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2">{dept.department}</Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {dept.employees} employees
                    </Typography>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Performance Metrics
              </Typography>
              <List>
                {performanceMetrics.map((metric, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2">{metric.metric}</Typography>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={600}
                      color={`${metric.color}.main`}
                    >
                      {metric.value}
                    </Typography>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Key Metrics
              </Typography>
              <List>
                {keyMetrics.map((metric, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2">{metric.metric}</Typography>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={600}
                      color={`${metric.color}.main`}
                    >
                      {metric.value}
                    </Typography>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}