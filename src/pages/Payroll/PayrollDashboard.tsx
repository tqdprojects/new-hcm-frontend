import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AttachMoney,
  People,
  TrendingUp,
  Assessment,
  PlayArrow,
  Schedule,
  Business,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { usePayrollSummary, usePayrollTrends } from '../../hooks/usePayroll';
import BranchSelector from '../../components/Branch/BranchSelector';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PayrollDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [tabValue, setTabValue] = useState(0);

  const { data: summaryResponse } = usePayrollSummary({ branchId: selectedBranch });
  const { data: trendsResponse } = usePayrollTrends(selectedPeriod, selectedBranch);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const payrollMetrics = [
    {
      title: 'Total Payroll Cost',
      value: '$2.45M',
      change: 3.2,
      icon: AttachMoney,
      color: 'primary',
    },
    {
      title: 'Employees Processed',
      value: '2,847',
      change: 1.8,
      icon: People,
      color: 'success',
    },
    {
      title: 'Average Salary',
      value: '$85,200',
      change: 2.5,
      icon: TrendingUp,
      color: 'info',
    },
    {
      title: 'Processing Time',
      value: '4.2 days',
      change: -0.8,
      icon: Schedule,
      color: 'warning',
    },
  ];

  const recentPayrollRuns = [
    {
      id: '1',
      period: 'December 2024',
      status: 'completed',
      employees: 2847,
      totalCost: 2450000,
      processedAt: '2024-12-01',
    },
    {
      id: '2',
      period: 'November 2024',
      status: 'completed',
      employees: 2820,
      totalCost: 2380000,
      processedAt: '2024-11-01',
    },
    {
      id: '3',
      period: 'October 2024',
      status: 'completed',
      employees: 2795,
      totalCost: 2320000,
      processedAt: '2024-10-01',
    },
  ];

  const departmentCosts = [
    { department: 'Engineering', cost: 980000, employees: 840, avgSalary: 116667 },
    { department: 'Sales', cost: 624000, employees: 520, avgSalary: 120000 },
    { department: 'Marketing', cost: 336000, employees: 280, avgSalary: 120000 },
    { department: 'HR', cost: 144000, employees: 120, avgSalary: 120000 },
    { department: 'Finance', cost: 114000, employees: 95, avgSalary: 120000 },
    { department: 'Operations', cost: 216000, employees: 180, avgSalary: 120000 },
  ];

  const salaryDistribution = [
    { range: '$40K-60K', count: 450, color: '#1976d2' },
    { range: '$60K-80K', count: 820, color: '#00796b' },
    { range: '$80K-100K', count: 950, color: '#388e3c' },
    { range: '$100K-120K', count: 420, color: '#f57c00' },
    { range: '$120K+', count: 207, color: '#d32f2f' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const maxDeptCost = Math.max(...departmentCosts.map((d) => d.cost));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Payroll Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor payroll processing and analyze compensation data
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => navigate('/payroll/global')}
          >
            Global Payroll
          </Button>
          <Button
            variant="outlined"
            startIcon={<Business />}
            onClick={() => navigate('/payroll/branches')}
          >
            Branch Payrolls
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={() => navigate('/payroll/runs')}
          >
            Process Payroll
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <BranchSelector
                value={selectedBranch}
                onChange={setSelectedBranch}
                label="Filter by Branch"
                showAll={true}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="Period"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <MenuItem value="3m">Last 3 Months</MenuItem>
                  <MenuItem value="6m">Last 6 Months</MenuItem>
                  <MenuItem value="12m">Last 12 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => navigate('/payroll/analytics')}
              >
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {payrollMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: `${metric.color}.main` }}>
                      <IconComponent />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={600}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={metric.change > 0 ? 'success.main' : 'error.main'}
                      >
                        {metric.change > 0 ? '+' : ''}
                        {metric.change}% from last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Recent Runs" />
            <Tab label="Department Analysis" />
            <Tab label="Salary Distribution" />
            <Tab label="Cost Trends" />
          </Tabs>
        </Box>

        {/* Recent Runs */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Payroll Runs
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Employees</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                  <TableCell>Processed Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPayrollRuns.map((run) => (
                  <TableRow key={run.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {run.period}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={run.status}
                        color={getStatusColor(run.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">{run.employees.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      ${run.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell>{format(new Date(run.processedAt), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Department Analysis */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payroll Cost by Department
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${(value as number).toLocaleString()}`,
                        'Total Cost',
                      ]}
                    />
                    <Bar dataKey="cost" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Department Summary
              </Typography>
              {departmentCosts.map((dept) => (
                <Card key={dept.department} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {dept.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dept.employees} employees • Avg: ${dept.avgSalary.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(dept.cost / maxDeptCost) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Salary Distribution */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Salary Range Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="count"
                      label={({ range, percent }) =>
                        `${range} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {salaryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Distribution Details
              </Typography>
              {salaryDistribution.map((range) => (
                <Box
                  key={range.range}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 1,
                      bgcolor: range.color,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {range.range}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {range.count} employees
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {((range.count / 2847) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Cost Trends */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Payroll Cost Trends (12 Months)
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: 'Jan', cost: 2200000, employees: 2650 },
                  { month: 'Feb', cost: 2250000, employees: 2680 },
                  { month: 'Mar', cost: 2300000, employees: 2720 },
                  { month: 'Apr', cost: 2320000, employees: 2750 },
                  { month: 'May', cost: 2350000, employees: 2780 },
                  { month: 'Jun', cost: 2380000, employees: 2810 },
                  { month: 'Jul', cost: 2400000, employees: 2830 },
                  { month: 'Aug', cost: 2420000, employees: 2840 },
                  { month: 'Sep', cost: 2430000, employees: 2845 },
                  { month: 'Oct', cost: 2440000, employees: 2846 },
                  { month: 'Nov', cost: 2445000, employees: 2847 },
                  { month: 'Dec', cost: 2450000, employees: 2847 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'cost'
                      ? `$${(value as number).toLocaleString()}`
                      : value,
                    name === 'cost' ? 'Total Cost' : 'Employees',
                  ]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cost"
                  stroke="#1976d2"
                  strokeWidth={3}
                  name="cost"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="employees"
                  stroke="#00796b"
                  strokeWidth={3}
                  name="employees"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
}
