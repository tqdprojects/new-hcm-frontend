import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  CheckCircle,
  Warning,
  Error,
  Assessment,
  AccountBalance,
  Public,
  Schedule,
  Security,
  TrendingUp,
  AttachMoney,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import MetricCard from '../../components/Dashboard/MetricCard';

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

export default function GlobalPayrollDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [initializeDialog, setInitializeDialog] = useState(false);
  const [selectedPayGroup, setSelectedPayGroup] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for demonstration
  const payrollRuns = [
    {
      id: '1',
      runId: 'PR202412001',
      payGroup: 'US Employees',
      country: 'US',
      currency: 'USD',
      period: 'December 2024',
      status: 'completed',
      employeeCount: 847,
      totalCost: 2450000,
      cycleTime: 4.2,
      rightFirstTime: 96.5,
      createdAt: '2024-12-01',
    },
    {
      id: '2',
      runId: 'PR202412002',
      payGroup: 'UK Employees',
      country: 'UK',
      currency: 'GBP',
      period: 'December 2024',
      status: 'pending-approval',
      employeeCount: 234,
      totalCost: 1850000,
      cycleTime: 3.8,
      rightFirstTime: 94.2,
      createdAt: '2024-12-02',
    },
    {
      id: '3',
      runId: 'PR202412003',
      payGroup: 'India Employees',
      country: 'IN',
      currency: 'INR',
      period: 'December 2024',
      status: 'calculating',
      employeeCount: 1250,
      totalCost: 45000000,
      cycleTime: 0,
      rightFirstTime: 0,
      createdAt: '2024-12-03',
    },
  ];

  const globalMetrics = [
    {
      title: 'Global Payroll Cost',
      value: '$8.2M',
      change: 3.2,
      changeType: 'increase' as const,
      icon: AttachMoney,
      color: 'primary' as const,
    },
    {
      title: 'Active Countries',
      value: '12',
      subtitle: '3 Currencies',
      icon: Public,
      color: 'info' as const,
    },
    {
      title: 'Compliance Rate',
      value: '99.2%',
      change: 0.8,
      changeType: 'increase' as const,
      icon: Security,
      color: 'success' as const,
    },
    {
      title: 'Avg Cycle Time',
      value: '4.1 days',
      change: -0.3,
      changeType: 'decrease' as const,
      icon: Schedule,
      color: 'success' as const,
    },
  ];

  const payrollSteps = [
    { label: 'Input Freeze', description: 'Validate and freeze all input data' },
    { label: 'Draft Calculation', description: 'Calculate gross, deductions, and net pay' },
    { label: 'Review & Variance', description: 'Review calculations and variance reports' },
    { label: 'Approval Workflow', description: 'Multi-level approval process' },
    { label: 'Finalization', description: 'Generate payslips and bank files' },
    { label: 'Disbursement', description: 'Execute payments and compliance' },
  ];

  const countryBreakdown = [
    { country: 'United States', employees: 847, cost: 2450000, currency: 'USD', color: '#1976d2' },
    { country: 'United Kingdom', employees: 234, cost: 1850000, currency: 'GBP', color: '#00796b' },
    { country: 'India', employees: 1250, cost: 45000000, currency: 'INR', color: '#388e3c' },
    { country: 'Canada', employees: 156, cost: 980000, currency: 'CAD', color: '#f57c00' },
    { country: 'Australia', employees: 89, cost: 720000, currency: 'AUD', color: '#d32f2f' },
  ];

  const complianceCalendar = [
    { event: 'US Payroll Tax Filing', dueDate: '2024-12-31', status: 'completed', country: 'US' },
    { event: 'UK PAYE Submission', dueDate: '2025-01-19', status: 'pending', country: 'UK' },
    { event: 'India PF Contribution', dueDate: '2025-01-15', status: 'pending', country: 'IN' },
    { event: 'Canada CPP/EI Filing', dueDate: '2025-01-31', status: 'upcoming', country: 'CA' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending-approval': return 'warning';
      case 'calculating': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending-approval': return <Warning />;
      case 'calculating': return <PlayArrow />;
      case 'failed': return <Error />;
      default: return <Pause />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Global Payroll Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enterprise-grade payroll processing across multiple countries and currencies
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={() => setInitializeDialog(true)}
          size="large"
        >
          Initialize Payroll Run
        </Button>
      </Box>

      {/* Global Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {globalMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: `${metric.color}.main`,
                    color: 'white'
                  }}>
                    <metric.icon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    {metric.subtitle && (
                      <Typography variant="caption" color="text.secondary">
                        {metric.subtitle}
                      </Typography>
                    )}
                    {metric.change && (
                      <Typography 
                        variant="caption" 
                        color={metric.changeType === 'increase' ? 'success.main' : 'error.main'}
                        sx={{ display: 'block' }}
                      >
                        {metric.changeType === 'increase' ? '+' : ''}{metric.change}%
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Active Runs" />
            <Tab label="Country Breakdown" />
            <Tab label="Compliance Calendar" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Active Runs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Current Payroll Runs
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => navigate('/payroll/global/analytics')}
            >
              View Analytics
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Run ID</TableCell>
                  <TableCell>Pay Group</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Employees</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Cycle Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrollRuns.map((run) => (
                  <TableRow key={run.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {run.runId}
                      </Typography>
                    </TableCell>
                    <TableCell>{run.payGroup}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{run.country}</span>
                        <Chip label={run.currency} size="small" variant="outlined" />
                      </Box>
                    </TableCell>
                    <TableCell>{run.period}</TableCell>
                    <TableCell>{run.employeeCount.toLocaleString()}</TableCell>
                    <TableCell>
                      {run.currency} {run.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(run.status)}
                        label={run.status.replace('-', ' ')}
                        color={getStatusColor(run.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {run.cycleTime > 0 ? `${run.cycleTime} days` : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => setSelectedRun(run)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Country Breakdown Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payroll Cost by Country
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${name === 'cost' ? '$' : ''}${(value as number).toLocaleString()}`,
                        name === 'cost' ? 'Total Cost' : 'Employees'
                      ]}
                    />
                    <Bar dataKey="employees" fill="#1976d2" name="employees" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Employee Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="employees"
                      label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                    >
                      {countryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Country</TableCell>
                      <TableCell align="right">Employees</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                      <TableCell align="right">Avg Salary</TableCell>
                      <TableCell>Currency</TableCell>
                      <TableCell>Last Run</TableCell>
                      <TableCell>Compliance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countryBreakdown.map((country) => (
                      <TableRow key={country.country} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {country.country}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {country.employees.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {country.currency} {country.cost.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {country.currency} {Math.round(country.cost / country.employees).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip label={country.currency} size="small" />
                        </TableCell>
                        <TableCell>Dec 2024</TableCell>
                        <TableCell>
                          <Chip label="Compliant" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Compliance Calendar Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Upcoming Compliance Events
          </Typography>
          
          <Grid container spacing={3}>
            {complianceCalendar.map((event, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid ${
                      event.status === 'completed' ? '#4caf50' :
                      event.status === 'pending' ? '#ff9800' : '#2196f3'
                    }`
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {event.event}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {event.country} • Due: {event.dueDate}
                        </Typography>
                        <Chip
                          label={event.status}
                          size="small"
                          color={
                            event.status === 'completed' ? 'success' :
                            event.status === 'pending' ? 'warning' : 'info'
                          }
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      {event.status === 'pending' && (
                        <Button size="small" variant="outlined">
                          Submit
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payroll Cycle Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { month: 'Jul', cycleTime: 4.8, rightFirstTime: 92.1 },
                        { month: 'Aug', cycleTime: 4.5, rightFirstTime: 94.3 },
                        { month: 'Sep', cycleTime: 4.2, rightFirstTime: 95.8 },
                        { month: 'Oct', cycleTime: 4.0, rightFirstTime: 96.2 },
                        { month: 'Nov', cycleTime: 3.8, rightFirstTime: 97.1 },
                        { month: 'Dec', cycleTime: 4.1, rightFirstTime: 96.5 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="cycleTime"
                          stroke="#1976d2"
                          strokeWidth={3}
                          name="Cycle Time (days)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rightFirstTime"
                          stroke="#00796b"
                          strokeWidth={3}
                          name="Right First Time (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Cost Trends (6 Months)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: 'Jul', cost: 7800000 },
                        { month: 'Aug', cost: 7950000 },
                        { month: 'Sep', cost: 8100000 },
                        { month: 'Oct', cost: 8050000 },
                        { month: 'Nov', cost: 8150000 },
                        { month: 'Dec', cost: 8200000 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Total Cost']} />
                        <Bar dataKey="cost" fill="#1976d2" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    SLA Performance Dashboard
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="success.main">
                          96.5%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Right First Time Rate
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={96.5} 
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="info.main">
                          4.1
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Cycle Time (days)
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={82} 
                          sx={{ 
                            mt: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': { bgcolor: 'info.main' }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="warning.main">
                          98.7%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          On-Time Payment Rate
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={98.7} 
                          sx={{ 
                            mt: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="success.main">
                          99.2%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Compliance Rate
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={99.2} 
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Country Breakdown Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {countryBreakdown.map((country) => (
              <Grid item xs={12} md={6} lg={4} key={country.country}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {country.country}
                      </Typography>
                      <Chip label={country.currency} color="primary" size="small" />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h5" fontWeight={600} color="primary.main">
                          {country.employees}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Employees
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5" fontWeight={600} color="success.main">
                          {country.currency} {(country.cost / 1000000).toFixed(1)}M
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Cost
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Average Salary: {country.currency} {Math.round(country.cost / country.employees).toLocaleString()}
                        </Typography>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/payroll/global/country/${country.country.toLowerCase()}`)}
                        >
                          View Details
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Compliance Calendar Tab */}
        <TabPanel value={tabValue} index={2}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Stay compliant with global statutory requirements. All deadlines are tracked automatically with advance notifications.
          </Alert>
          
          <Grid container spacing={3}>
            {complianceCalendar.map((event, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid ${
                      event.status === 'completed' ? '#4caf50' :
                      event.status === 'pending' ? '#ff9800' : '#2196f3'
                    }`
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {event.event}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {event.country} • Due: {event.dueDate}
                        </Typography>
                        <Chip
                          label={event.status}
                          size="small"
                          color={
                            event.status === 'completed' ? 'success' :
                            event.status === 'pending' ? 'warning' : 'info'
                          }
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      {event.status === 'pending' && (
                        <Button size="small" variant="outlined">
                          Submit
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Global Payroll Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive analytics and insights across all countries and pay groups
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={() => navigate('/payroll/global/analytics')}
          >
            Open Full Analytics Dashboard
          </Button>
        </TabPanel>
      </Card>

      {/* Run Details Dialog */}
      {selectedRun && (
        <Dialog
          open={!!selectedRun}
          onClose={() => setSelectedRun(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Payroll Run Details - {selectedRun.runId}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Basic Information
                </Typography>
                <Typography variant="body2">
                  <strong>Pay Group:</strong> {selectedRun.payGroup}
                </Typography>
                <Typography variant="body2">
                  <strong>Country:</strong> {selectedRun.country}
                </Typography>
                <Typography variant="body2">
                  <strong>Period:</strong> {selectedRun.period}
                </Typography>
                <Typography variant="body2">
                  <strong>Employees:</strong> {selectedRun.employeeCount}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Performance Metrics
                </Typography>
                <Typography variant="body2">
                  <strong>Total Cost:</strong> {selectedRun.currency} {selectedRun.totalCost.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Cycle Time:</strong> {selectedRun.cycleTime} days
                </Typography>
                <Typography variant="body2">
                  <strong>Right First Time:</strong> {selectedRun.rightFirstTime}%
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Workflow Progress
                </Typography>
                <Stepper orientation="vertical">
                  {payrollSteps.map((step, index) => (
                    <Step key={step.label} active={index <= 3} completed={index < 3}>
                      <StepLabel>{step.label}</StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRun(null)}>
              Close
            </Button>
            <Button variant="contained">
              View Full Details
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Initialize Payroll Dialog */}
      <Dialog
        open={initializeDialog}
        onClose={() => setInitializeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Initialize New Payroll Run</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Pay Group</InputLabel>
                <Select
                  value={selectedPayGroup}
                  onChange={(e) => setSelectedPayGroup(e.target.value)}
                  label="Pay Group"
                >
                  <MenuItem value="us-employees">US Employees (Monthly)</MenuItem>
                  <MenuItem value="uk-employees">UK Employees (Monthly)</MenuItem>
                  <MenuItem value="india-employees">India Employees (Monthly)</MenuItem>
                  <MenuItem value="canada-employees">Canada Employees (Bi-weekly)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Pay Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Pay Period"
                >
                  <MenuItem value="2024-12">December 2024</MenuItem>
                  <MenuItem value="2025-01">January 2025</MenuItem>
                  <MenuItem value="2025-02">February 2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInitializeDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedPayGroup || !selectedPeriod}
          >
            Initialize Run
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}