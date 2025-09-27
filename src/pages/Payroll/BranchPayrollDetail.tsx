import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Business,
  People,
  AttachMoney,
  CheckCircle,
  Warning,
  Download,
  Send,
  Visibility,
  Edit,
  Assessment,
  Schedule,
  AccountBalance,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  useBranchPayroll, 
  useApproveBranchPayroll, 
  useGenerateBranchPayslips,
  useExportBranchPayroll 
} from '../../hooks/useBranchPayroll';
import { useBranch } from '../../hooks/useBranches';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

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

export default function BranchPayrollDetail() {
  const { branchPayrollId } = useParams<{ branchPayrollId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [payslipDialog, setPayslipDialog] = useState(false);
  const [comments, setComments] = useState('');

  // Extract branch ID, month, year from the payroll ID (mock implementation)
  const branchId = 'branch-1'; // This would come from the payroll data
  const month = 12;
  const year = 2024;

  const { data: branchPayrollResponse, isLoading } = useBranchPayroll(branchId, month, year);
  const { data: branchResponse } = useBranch(branchId);
  
  const approveBranchPayroll = useApproveBranchPayroll();
  const generatePayslips = useGenerateBranchPayslips();
  const exportPayroll = useExportBranchPayroll();

  const branchPayroll = branchPayrollResponse?.data;
  const branch = branchResponse?.data;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleApprove = async () => {
    if (!branchPayrollId) return;
    
    await approveBranchPayroll.mutateAsync({
      branchPayrollId,
      comments
    });
    setApprovalDialog(false);
    setComments('');
  };

  const handleGeneratePayslips = async () => {
    if (!branchPayrollId) return;
    
    await generatePayslips.mutateAsync({
      branchPayrollId,
      sendEmail: true
    });
    setPayslipDialog(false);
  };

  const payrollSteps = [
    {
      label: 'Data Collection',
      description: 'Gather attendance, leave, and salary data',
      status: 'completed',
      complete: true
    },
    {
      label: 'Calculation',
      description: 'Calculate gross pay, deductions, and taxes',
      status: 'completed',
      complete: true
    },
    {
      label: 'Review & Validation',
      description: 'Review calculations and validate data',
      status: branchPayroll?.status === 'calculated' ? 'active' : 'completed',
      complete: branchPayroll?.status !== 'calculated'
    },
    {
      label: 'Approval',
      description: 'Management approval for payroll',
      status: branchPayroll?.status === 'approved' ? 'completed' : 'pending',
      complete: branchPayroll?.status === 'approved' || branchPayroll?.status === 'processed'
    },
    {
      label: 'Payment Processing',
      description: 'Generate payslips and process payments',
      status: branchPayroll?.status === 'processed' ? 'completed' : 'pending',
      complete: branchPayroll?.status === 'processed'
    }
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading branch payroll details..." />;
  }

  if (!branchPayroll || !branch) {
    return (
      <Alert severity="error">
        Branch payroll data not found. Please check the URL and try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/payroll/branches')}
          sx={{ mr: 2 }}
        >
          Back to Branch Payrolls
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            {branch.name} - Payroll Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {format(new Date(branchPayroll.payPeriod.year, branchPayroll.payPeriod.month - 1), 'MMMM yyyy')} • {branchPayroll.summary.totalEmployees} employees
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={branchPayroll.status}
            color={
              branchPayroll.status === 'processed' ? 'success' :
              branchPayroll.status === 'approved' ? 'info' :
              branchPayroll.status === 'calculated' ? 'warning' : 'default'
            }
            sx={{ textTransform: 'capitalize' }}
          />
          
          {branchPayroll.status === 'calculated' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => setApprovalDialog(true)}
            >
              Approve Payroll
            </Button>
          )}
          
          {branchPayroll.status === 'approved' && (
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={() => setPayslipDialog(true)}
            >
              Generate Payslips
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportPayroll.mutateAsync({ 
              branchPayrollId: branchPayrollId!, 
              format: 'excel' 
            })}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {branchPayroll.summary.totalEmployees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employees
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${branchPayroll.summary.totalGrossPay.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gross Pay
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${branchPayroll.summary.totalDeductions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deductions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${branchPayroll.summary.totalNetPay.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Net Pay
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Processing Workflow */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Payroll Processing Workflow
          </Typography>
          
          <Stepper orientation="horizontal" sx={{ mt: 2 }}>
            {payrollSteps.map((step, index) => (
              <Step key={step.label} completed={step.complete}>
                <StepLabel>
                  <Typography variant="body2" fontWeight={step.status === 'active' ? 600 : 400}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Employee Details" />
            <Tab label="Department Summary" />
            <Tab label="Payroll Breakdown" />
            <Tab label="Compliance" />
          </Tabs>
        </Box>

        {/* Employee Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell align="right">Gross Pay</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Net Pay</TableCell>
                  <TableCell align="center">Payslip</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchPayroll.employees.map((emp) => (
                  <TableRow key={emp.employeeId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {emp.employee.firstName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {emp.employee.firstName} {emp.employee.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {emp.employee.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{emp.employee.department}</TableCell>
                    <TableCell>{emp.employee.designation}</TableCell>
                    <TableCell align="right">
                      ${emp.grossPay.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${emp.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${emp.netPay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={emp.payslipGenerated ? 'Generated' : 'Pending'}
                        size="small"
                        color={emp.payslipGenerated ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {emp.payslipGenerated && (
                          <Tooltip title="Download Payslip">
                            <IconButton size="small">
                              <Download />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Department Summary Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Mock department data */}
            {['Engineering', 'Sales', 'Marketing', 'HR'].map((dept, index) => (
              <Grid item xs={12} md={6} key={dept}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {dept} Department
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Employees
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {Math.floor(Math.random() * 50) + 10}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Cost
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="primary.main">
                          ${(Math.random() * 200000 + 100000).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Average Salary: ${(Math.random() * 30000 + 50000).toLocaleString()}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.random() * 40 + 60}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payroll Breakdown Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Earnings Breakdown
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Basic Salary</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalGrossPay * 0.6).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Allowances</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalGrossPay * 0.3).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Variable Pay</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalGrossPay * 0.1).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: 'success.light' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Total Earnings</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${branchPayroll.summary.totalGrossPay.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Deductions Breakdown
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Income Tax</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalDeductions * 0.5).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provident Fund</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalDeductions * 0.3).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Health Insurance</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalDeductions * 0.15).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other Deductions</TableCell>
                        <TableCell align="right">
                          ${(branchPayroll.summary.totalDeductions * 0.05).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: 'error.light' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Total Deductions</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${branchPayroll.summary.totalDeductions.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={600}>
                    ${branchPayroll.summary.totalNetPay.toLocaleString()}
                  </Typography>
                  <Typography variant="h6">
                    Total Net Payroll
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {branch.currency} • {format(new Date(branchPayroll.payPeriod.year, branchPayroll.payPeriod.month - 1), 'MMMM yyyy')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Compliance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Tax Compliance
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Income Tax Calculation"
                        secondary="All calculations verified and compliant"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Statutory Deductions"
                        secondary="PF, ESI, and other statutory deductions applied"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Professional Tax"
                        secondary="Verify state-specific professional tax rates"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Labor Law Compliance
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Minimum Wage Compliance"
                        secondary="All salaries meet minimum wage requirements"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Overtime Calculations"
                        secondary="Overtime calculated as per labor laws"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Leave Encashment"
                        secondary="Leave policies applied correctly"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog}
        onClose={() => setApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Branch Payroll</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to approve payroll for {branchPayroll.summary.totalEmployees} employees 
            with a total net pay of ${branchPayroll.summary.totalNetPay.toLocaleString()}.
          </Alert>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Comments (Optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            disabled={approveBranchPayroll.isPending}
          >
            {approveBranchPayroll.isPending ? 'Approving...' : 'Approve Payroll'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Payslips Dialog */}
      <Dialog
        open={payslipDialog}
        onClose={() => setPayslipDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Payslips</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will generate payslips for all {branchPayroll.summary.totalEmployees} employees 
            and send them via email.
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            Payslips will be generated in PDF format and automatically sent to employee email addresses.
            This process may take a few minutes to complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayslipDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGeneratePayslips}
            disabled={generatePayslips.isPending}
          >
            {generatePayslips.isPending ? 'Generating...' : 'Generate & Send Payslips'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}