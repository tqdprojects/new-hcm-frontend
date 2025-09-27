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
  AttachMoney,
  Receipt,
  PieChart,
  Assessment,
  Warning,
  CheckCircle,
  Schedule,
  AccountBalance,
  CreditCard,
  MonetizationOn,
  MoreVert,
  Psychology,
  Add,
  Edit,
  Visibility,
  Download,
  Analytics,
  Timeline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import MetricCard from '../../components/Dashboard/MetricCard';
import { useNotificationStore } from '../../stores/notificationStore';

export const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [budgetDialog, setBudgetDialog] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const financeMetrics = [
    {
      title: 'Monthly Payroll',
      value: '$2.1M',
      change: 8.7,
      changeType: 'increase' as const,
      icon: AttachMoney,
      color: 'primary' as const,
    },
    {
      title: 'Pending Claims',
      value: 47,
      change: -15.2,
      changeType: 'decrease' as const,
      icon: Receipt,
      color: 'warning' as const,
    },
    {
      title: 'Budget Utilization',
      value: '78.5%',
      change: 5.3,
      changeType: 'percentage' as const,
      icon: PieChart,
      color: 'success' as const,
    },
    {
      title: 'Cost Savings',
      value: '$125K',
      change: 22.1,
      changeType: 'increase' as const,
      icon: AccountBalance,
      color: 'secondary' as const,
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Expense Claim',
      employee: 'Sarah Johnson',
      amount: '$1,250',
      category: 'Travel',
      date: '2024-01-15',
      priority: 'high',
      description: 'Client meeting travel expenses',
    },
    {
      id: 2,
      type: 'Reimbursement',
      employee: 'Mike Davis',
      amount: '$450',
      category: 'Equipment',
      date: '2024-01-14',
      priority: 'medium',
      description: 'Office equipment purchase',
    },
    {
      id: 3,
      type: 'Budget Request',
      employee: 'Lisa Chen',
      amount: '$5,000',
      category: 'Marketing',
      date: '2024-01-13',
      priority: 'high',
      description: 'Q1 marketing campaign budget',
    },
    {
      id: 4,
      type: 'Expense Claim',
      employee: 'John Smith',
      amount: '$320',
      category: 'Meals',
      date: '2024-01-12',
      priority: 'low',
      description: 'Team lunch expenses',
    },
  ];

  const payrollSummary = [
    {
      department: 'Engineering',
      employees: 156,
      grossPay: '$890,000',
      deductions: '$178,000',
      netPay: '$712,000',
      status: 'processed',
    },
    {
      department: 'Sales & Marketing',
      employees: 89,
      grossPay: '$520,000',
      deductions: '$104,000',
      netPay: '$416,000',
      status: 'processed',
    },
    {
      department: 'Operations',
      employees: 67,
      grossPay: '$380,000',
      deductions: '$76,000',
      netPay: '$304,000',
      status: 'pending',
    },
    {
      department: 'Human Resources',
      employees: 45,
      grossPay: '$310,000',
      deductions: '$62,000',
      netPay: '$248,000',
      status: 'processed',
    },
  ];

  const budgetData = [
    { department: 'Engineering', allocated: 1200000, spent: 980000, remaining: 220000 },
    { department: 'Sales', allocated: 800000, spent: 650000, remaining: 150000 },
    { department: 'Marketing', allocated: 500000, spent: 420000, remaining: 80000 },
    { department: 'HR', allocated: 300000, spent: 245000, remaining: 55000 },
    { department: 'Operations', allocated: 400000, spent: 380000, remaining: 20000 },
  ];

  const expenseCategories = [
    { name: 'Travel', value: 35, color: '#1976d2' },
    { name: 'Equipment', value: 25, color: '#00796b' },
    { name: 'Training', value: 20, color: '#388e3c' },
    { name: 'Meals', value: 15, color: '#f57c00' },
    { name: 'Other', value: 5, color: '#d32f2f' },
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'Anomaly Detection',
      message: 'Unusual expense pattern detected in Travel category - 40% increase',
      severity: 'warning',
      action: 'Review Required',
      confidence: 0.89,
    },
    {
      id: 2,
      type: 'Cost Optimization',
      message: 'Potential savings of $15K identified in vendor contracts',
      severity: 'info',
      action: 'Opportunity',
      confidence: 0.92,
    },
    {
      id: 3,
      type: 'Budget Alert',
      message: 'Marketing budget 85% utilized with 2 weeks remaining',
      severity: 'warning',
      action: 'Monitor',
      confidence: 0.95,
    },
  ];

  const handleApproveExpense = (expenseId: number) => {
    addNotification({
      title: 'Expense Approved',
      message: `Expense claim #${expenseId} has been approved`,
      type: 'success'
    });
  };

  const handleRejectExpense = (expenseId: number) => {
    addNotification({
      title: 'Expense Rejected',
      message: `Expense claim #${expenseId} has been rejected`,
      type: 'info'
    });
  };

  const handleProcessPayroll = () => {
    navigate('/payroll/runs');
  };

  const handleViewBudgets = () => {
    navigate('/finance/budgets');
  };

  const handleViewReports = () => {
    navigate('/reports/financial');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Finance Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            onClick={handleViewReports}
          >
            Financial Reports
          </Button>
          <Button
            variant="contained"
            startIcon={<AttachMoney />}
            onClick={handleProcessPayroll}
          >
            Process Payroll
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {financeMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Financial Approvals */}
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
                  onClick={() => navigate('/claims')}
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
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApproveExpense(approval.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRejectExpense(approval.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {approval.type === 'Expense Claim' ? <Receipt /> : 
                           approval.type === 'Reimbursement' ? <CreditCard /> : <MonetizationOn />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {approval.type}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {approval.amount}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {approval.employee} - {approval.category}
                            </Typography>
                            <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {approval.description}
                            </Box>
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

        {/* AI Finance Insights */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Finance Insights
                </Typography>
              </Box>
              <List>
                {aiInsights.map((insight, index) => (
                  <React.Fragment key={insight.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getSeverityIcon(insight.severity)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {insight.type}
                            </Typography>
                            <Chip label={insight.action} size="small" variant="outlined" />
                            <Chip 
                              label={`${Math.round(insight.confidence * 100)}%`} 
                              size="small" 
                              color="primary" 
                            />
                          </Box>
                        }
                        secondary={insight.message}
                      />
                    </ListItem>
                    {index < aiInsights.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button 
                variant="text" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => navigate('/ai')}
              >
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Overview */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Department Budget Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setBudgetDialog(true)}
                  >
                    Add Budget
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Analytics />}
                    onClick={handleViewBudgets}
                  >
                    Manage Budgets
                  </Button>
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, '']} />
                    <Bar dataKey="allocated" fill="#1976d2" name="Allocated" />
                    <Bar dataKey="spent" fill="#00796b" name="Spent" />
                    <Bar dataKey="remaining" fill="#388e3c" name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Categories */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Expense Categories
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payroll Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Month Payroll Summary
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<Download />}
                    onClick={() => {
                      addNotification({
                        title: 'Export Started',
                        message: 'Payroll report export has been initiated',
                        type: 'info'
                      });
                    }}
                  >
                    Export
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<AttachMoney />}
                    onClick={handleProcessPayroll}
                  >
                    Process Payroll
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Employees</TableCell>
                      <TableCell align="right">Gross Pay</TableCell>
                      <TableCell align="right">Deductions</TableCell>
                      <TableCell align="right">Net Pay</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollSummary.map((dept) => (
                      <TableRow key={dept.department} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {dept.department}
                        </TableCell>
                        <TableCell align="right">{dept.employees}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {dept.grossPay}
                        </TableCell>
                        <TableCell align="right">{dept.deductions}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {dept.netPay}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={dept.status}
                            size="small"
                            color={getStatusColor(dept.status) as any}
                            icon={dept.status === 'processed' ? <CheckCircle /> : <Schedule />}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/payroll/department/${dept.department.toLowerCase()}`)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/payroll/department/${dept.department.toLowerCase()}/edit`)}
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
                    startIcon={<Receipt />}
                    onClick={() => navigate('/claims')}
                    sx={{ py: 2 }}
                  >
                    Review Claims
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PieChart />}
                    onClick={handleViewBudgets}
                    sx={{ py: 2 }}
                  >
                    Manage Budgets
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={handleViewReports}
                    sx={{ py: 2 }}
                  >
                    Generate Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Timeline />}
                    onClick={() => navigate('/finance/planning')}
                    sx={{ py: 2 }}
                  >
                    Financial Planning
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget Dialog */}
      <Dialog
        open={budgetDialog}
        onClose={() => setBudgetDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Department Budget</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select label="Department">
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Amount"
                type="number"
                placeholder="Enter budget amount"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Period"
                type="month"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Budget description and notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBudgetDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setBudgetDialog(false);
              addNotification({
                title: 'Budget Created',
                message: 'Department budget has been created successfully',
                type: 'success'
              });
            }}
          >
            Create Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};