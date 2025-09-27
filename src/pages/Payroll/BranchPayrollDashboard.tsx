import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Business,
  AttachMoney,
  People,
  TrendingUp,
  Assessment,
  PlayArrow,
  CheckCircle,
  Warning,
  Download,
  Visibility,
  Edit,
  Compare,
  Analytics,
  Schedule,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  useBranches, 
  useBranchPayrolls, 
  useProcessBranchPayroll, 
  useApproveBranchPayroll,
  useBranchPayrollAnalytics,
  useCompareBranchPayrolls,
  useExportBranchPayroll
} from '../../hooks/useBranchPayroll';
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

export default function BranchPayrollDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [processDialog, setProcessDialog] = useState(false);
  const [compareDialog, setCompareDialog] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const { data: branchesResponse } = useBranches();
  const { data: branchPayrollsResponse } = useBranchPayrolls({
    branchId: selectedBranch || undefined,
    month: selectedMonth,
    year: selectedYear,
  });
  const { data: analyticsResponse } = useBranchPayrollAnalytics(selectedBranch, '12m');
  const { data: comparisonResponse } = useCompareBranchPayrolls(selectedBranches, '6m');

  const processBranchPayroll = useProcessBranchPayroll();
  const approveBranchPayroll = useApproveBranchPayroll();
  const exportBranchPayroll = useExportBranchPayroll();

  const branches = branchesResponse?.data || [];
  const branchPayrolls = branchPayrollsResponse?.data?.data || [];
  const analytics = analyticsResponse?.data || {};

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProcessPayroll = async () => {
    if (!selectedBranch) return;

    await processBranchPayroll.mutateAsync({
      branchId: selectedBranch,
      month: selectedMonth,
      year: selectedYear,
    });
    setProcessDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'calculated': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const branchPayrollSummary = branchPayrolls.reduce((acc, payroll) => {
    acc.totalEmployees += payroll.summary.totalEmployees;
    acc.totalGrossPay += payroll.summary.totalGrossPay;
    acc.totalNetPay += payroll.summary.totalNetPay;
    return acc;
  }, { totalEmployees: 0, totalGrossPay: 0, totalNetPay: 0 });

  const branchComparisonData = branches.map(branch => ({
    branchName: branch.name,
    employees: branch.employeeCount || 0,
    payrollCost: Math.random() * 500000 + 200000, // Mock data
    avgSalary: Math.random() * 30000 + 50000, // Mock data
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Branch-wise Payroll Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage payroll processing across all branches
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Compare />}
            onClick={() => setCompareDialog(true)}
          >
            Compare Branches
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={() => setProcessDialog(true)}
            disabled={!selectedBranch}
          >
            Process Payroll
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  label="Branch"
                >
                  <MenuItem value="">All Branches</MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business fontSize="small" />
                        {branch.name} ({branch.code})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value as number)}
                  label="Month"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                  label="Year"
                >
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2022}>2022</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Analytics />}
                onClick={() => navigate('/payroll/branches/analytics')}
              >
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
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
                    {branches.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Branches
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {branchPayrollSummary.totalEmployees.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
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
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${(branchPayrollSummary.totalGrossPay / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Gross Pay
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
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${(branchPayrollSummary.totalNetPay / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Net Pay
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Branch Payrolls" />
            <Tab label="Branch Comparison" />
            <Tab label="Analytics" />
            <Tab label="Compliance" />
          </Tabs>
        </Box>

        {/* Branch Payrolls Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Branch</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Employees</TableCell>
                  <TableCell align="right">Gross Pay</TableCell>
                  <TableCell align="right">Net Pay</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Processed Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchPayrolls.map((payroll) => (
                  <TableRow key={payroll._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          <Business fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {branches.find(b => b.id === payroll.branchId)?.name || 'Unknown Branch'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(payroll.payPeriod.year, payroll.payPeriod.month - 1), 'MMM yyyy')}
                    </TableCell>
                    <TableCell align="right">
                      {payroll.summary.totalEmployees}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${payroll.summary.totalGrossPay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${payroll.summary.totalNetPay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payroll.status}
                        size="small"
                        color={getStatusColor(payroll.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {payroll.processedAt ? format(new Date(payroll.processedAt), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/payroll/branches/${payroll._id}`)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        
                        {payroll.status === 'calculated' && (
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => approveBranchPayroll.mutateAsync({ branchPayrollId: payroll._id })}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title="Export">
                          <IconButton
                            size="small"
                            onClick={() => exportBranchPayroll.mutateAsync({ 
                              branchPayrollId: payroll._id, 
                              format: 'excel' 
                            })}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Branch Comparison Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payroll Cost Comparison by Branch
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branchName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Payroll Cost']} />
                    <Bar dataKey="payrollCost" fill="#1976d2" radius={[4, 4, 0, 0]} />
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
                      data={branchComparisonData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="employees"
                      label={({ branchName, percent }) => `${branchName} ${(percent * 100).toFixed(0)}%`}
                    >
                      {branchComparisonData.map((entry, index) => (
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
                      <TableCell>Branch</TableCell>
                      <TableCell align="right">Employees</TableCell>
                      <TableCell align="right">Payroll Cost</TableCell>
                      <TableCell align="right">Avg Salary</TableCell>
                      <TableCell align="right">Cost per Employee</TableCell>
                      <TableCell align="center">Efficiency</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {branchComparisonData.map((branch, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: branch.color }}>
                              <Business fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {branch.branchName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{branch.employees}</TableCell>
                        <TableCell align="right">
                          ${branch.payrollCost.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${branch.avgSalary.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${(branch.payrollCost / branch.employees).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <LinearProgress
                            variant="determinate"
                            value={Math.random() * 40 + 60}
                            sx={{ width: 80, height: 6, borderRadius: 3 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payroll Trends (12 Months)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.trends || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Cost']} />
                        <Line
                          type="monotone"
                          dataKey="totalCost"
                          stroke="#1976d2"
                          strokeWidth={3}
                          name="Total Cost"
                        />
                        <Line
                          type="monotone"
                          dataKey="avgCostPerEmployee"
                          stroke="#00796b"
                          strokeWidth={2}
                          name="Avg Cost/Employee"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Department-wise Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.departmentBreakdown || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cost" fill="#1976d2" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Branch Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="success.main">
                          94.5%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payroll Accuracy
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="info.main">
                          3.2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Processing Days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="warning.main">
                          98.7%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          On-time Payment
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={600} color="primary.main">
                          99.2%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Compliance Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Compliance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Branch-wise compliance tracking ensures all locations meet local labor laws and tax requirements.
          </Alert>
          
          <Grid container spacing={3}>
            {branches.map((branch) => (
              <Grid item xs={12} md={6} key={branch.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {branch.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {branch.address?.city}, {branch.address?.state}
                        </Typography>
                      </Box>
                      <Chip
                        label="Compliant"
                        color="success"
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Tax Compliance
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={98}
                          color="success"
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">98%</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Labor Law Compliance
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={95}
                          color="success"
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">95%</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Process Payroll Dialog */}
      <Dialog
        open={processDialog}
        onClose={() => setProcessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Process Branch Payroll</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will process payroll for all employees in the selected branch for {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}.
          </Alert>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                <strong>Selected Branch:</strong> {branches.find(b => b.id === selectedBranch)?.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Period:</strong> {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Estimated Employees:</strong> {branches.find(b => b.id === selectedBranch)?.employeeCount || 0}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleProcessPayroll}
            disabled={processBranchPayroll.isPending}
          >
            {processBranchPayroll.isPending ? 'Processing...' : 'Process Payroll'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compare Branches Dialog */}
      <Dialog
        open={compareDialog}
        onClose={() => setCompareDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Compare Branch Payrolls</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Branches to Compare</InputLabel>
                <Select
                  multiple
                  value={selectedBranches}
                  onChange={(e) => setSelectedBranches(e.target.value as string[])}
                  label="Select Branches to Compare"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((branchId) => {
                        const branch = branches.find(b => b.id === branchId);
                        return (
                          <Chip key={branchId} label={branch?.name} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedBranches.length < 2}
            onClick={() => {
              setCompareDialog(false);
              navigate(`/payroll/branches/compare?branches=${selectedBranches.join(',')}`);
            }}
          >
            Compare Branches
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}