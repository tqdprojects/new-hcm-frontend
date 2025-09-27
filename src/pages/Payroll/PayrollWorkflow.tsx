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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Assessment,
  AccountBalance,
  Security,
  People,
  AttachMoney,
  Description,
  CloudUpload,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

export default function PayrollWorkflow() {
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  const [activeStep, setActiveStep] = useState(2);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
  }>({ open: false, action: '', title: '' });
  const [comments, setComments] = useState('');

  // Mock payroll run data
  const payrollRun = {
    runId: 'PR202412001',
    payGroup: 'US Employees',
    country: 'United States',
    currency: 'USD',
    period: {
      name: 'December 2024',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      payDate: '2024-12-31',
      cutoffDate: '2024-12-25'
    },
    status: 'review',
    employeeCount: 847,
    totalCost: 2450000,
    slaMetrics: {
      inputFreezeTime: '2024-12-20T09:00:00Z',
      calculationTime: 2.5,
      rightFirstTimeRate: 96.5,
      exceptionsCount: 12
    },
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Sarah Johnson', status: 'pending', dueDate: '2024-12-22' },
      { level: 2, role: 'Finance Manager', approver: 'Michael Chen', status: 'pending', dueDate: '2024-12-23' },
      { level: 3, role: 'Country Compliance', approver: 'Lisa Rodriguez', status: 'pending', dueDate: '2024-12-24' }
    ],
    calculations: {
      processed: 835,
      exceptions: 12,
      totalGross: 2450000,
      totalDeductions: 490000,
      totalTax: 367500,
      totalNet: 1592500
    },
    complianceChecks: [
      { rule: 'Minimum Wage Compliance', status: 'passed', severity: 'high' },
      { rule: 'Tax Withholding Accuracy', status: 'passed', severity: 'critical' },
      { rule: 'Social Security Limits', status: 'warning', severity: 'medium', message: '3 employees near ceiling' },
      { rule: 'Bank Account Validation', status: 'failed', severity: 'high', message: '5 invalid bank accounts' }
    ]
  };

  const workflowSteps = [
    {
      label: 'Input Freeze',
      description: 'Validate and freeze all input data sources',
      status: 'completed',
      completedAt: '2024-12-20 09:00',
      details: [
        'Employee data validated',
        'Attendance records frozen',
        'Leave approvals confirmed',
        'Timesheet submissions locked'
      ]
    },
    {
      label: 'Draft Calculation',
      description: 'Calculate gross pay, deductions, and taxes',
      status: 'completed',
      completedAt: '2024-12-20 11:30',
      details: [
        `${payrollRun.calculations.processed} employees processed`,
        `${payrollRun.calculations.exceptions} exceptions identified`,
        'Country-specific tax rules applied',
        'Employer contributions calculated'
      ]
    },
    {
      label: 'Review & Variance',
      description: 'Review calculations and analyze variances',
      status: 'active',
      details: [
        'Variance reports generated',
        'Exception analysis completed',
        'Compliance checks running',
        'Manager review in progress'
      ]
    },
    {
      label: 'Approval Workflow',
      description: 'Multi-level approval process',
      status: 'pending',
      details: [
        'Payroll Admin approval pending',
        'Finance Manager approval pending',
        'Compliance approval pending'
      ]
    },
    {
      label: 'Finalization',
      description: 'Generate payslips and bank files',
      status: 'pending',
      details: [
        'Payslip generation',
        'Bank file creation',
        'GL export preparation',
        'Compliance report generation'
      ]
    },
    {
      label: 'Disbursement',
      description: 'Execute payments and notifications',
      status: 'pending',
      details: [
        'Bank file submission',
        'Payment processing',
        'Employee notifications',
        'Compliance submissions'
      ]
    }
  ];

  const handleStepAction = (action: string, title: string) => {
    setActionDialog({ open: true, action, title });
  };

  const executeAction = async () => {
    // Implementation would call appropriate API
    console.log(`Executing ${actionDialog.action} with comments:`, comments);
    setActionDialog({ open: false, action: '', title: '' });
    setComments('');
    
    // Update active step based on action
    if (actionDialog.action === 'submit-approval') {
      setActiveStep(3);
    } else if (actionDialog.action === 'approve') {
      setActiveStep(4);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'active':
        return <PlayArrow color="primary" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Schedule color="disabled" />;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Schedule color="disabled" />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Payroll Workflow - {payrollRun.runId}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {payrollRun.payGroup} • {payrollRun.period.name} • {payrollRun.employeeCount} employees
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={payrollRun.status}
            color={payrollRun.status === 'review' ? 'warning' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => navigate(`/payroll/global/runs/${runId}/analytics`)}
          >
            View Analytics
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Workflow Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Workflow Progress
              </Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {workflowSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => getStepIcon(step.status)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {step.label}
                        </Typography>
                        {step.completedAt && (
                          <Typography variant="caption" color="text.secondary">
                            {step.completedAt}
                          </Typography>
                        )}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {step.description}
                      </Typography>
                      
                      <List dense>
                        {step.details.map((detail, detailIndex) => (
                          <ListItem key={detailIndex} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 16 }} color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={detail}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {step.status === 'active' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          {index === 2 && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleStepAction('submit-approval', 'Submit for Approval')}
                            >
                              Submit for Approval
                            </Button>
                          )}
                          {index === 3 && (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => handleStepAction('approve', 'Approve Payroll Run')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleStepAction('reject', 'Reject Payroll Run')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary & Metrics */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Run Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Run Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Gross Pay
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      ${payrollRun.calculations.totalGross.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Net Pay
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="success.main">
                      ${payrollRun.calculations.totalNet.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Processed
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {payrollRun.calculations.processed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Exceptions
                      </Typography>
                      <Typography variant="h6" fontWeight={600} color="warning.main">
                        {payrollRun.calculations.exceptions}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* SLA Metrics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    SLA Performance
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Right First Time</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {payrollRun.slaMetrics.rightFirstTimeRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={payrollRun.slaMetrics.rightFirstTimeRate} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Calculation Time
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {payrollRun.slaMetrics.calculationTime} hours
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Input Freeze
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(payrollRun.slaMetrics.inputFreezeTime), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Compliance Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Compliance Checks
                  </Typography>
                  
                  <List dense>
                    {payrollRun.complianceChecks.map((check, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {getComplianceIcon(check.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={check.rule}
                          secondary={check.message}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Approval Chain */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Approval Chain
              </Typography>
              
              <Grid container spacing={3}>
                {payrollRun.approvalChain.map((approval, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Level {approval.level}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {approval.role}
                            </Typography>
                          </Box>
                          <Chip
                            label={approval.status}
                            size="small"
                            color={approval.status === 'approved' ? 'success' : 'warning'}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                          {approval.approver}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary">
                          Due: {approval.dueDate}
                        </Typography>
                        
                        {approval.status === 'pending' && index === 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              onClick={() => handleStepAction('approve', `Approve - ${approval.role}`)}
                            >
                              Approve
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Exception Management */}
        {payrollRun.calculations.exceptions > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Exceptions ({payrollRun.calculations.exceptions})
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/payroll/global/runs/${runId}/exceptions`)}
                  >
                    Manage Exceptions
                  </Button>
                </Box>
                
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {payrollRun.calculations.exceptions} employees require attention before proceeding to approval.
                </Alert>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Error color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Invalid Bank Accounts"
                      secondary="5 employees have invalid or missing bank account details"
                    />
                    <Button size="small" variant="outlined">
                      Fix
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Social Security Ceiling"
                      secondary="3 employees approaching annual contribution limits"
                    />
                    <Button size="small" variant="outlined">
                      Review
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Overtime Anomalies"
                      secondary="4 employees with unusual overtime hours"
                    />
                    <Button size="small" variant="outlined">
                      Verify
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => navigate(`/payroll/global/runs/${runId}/variance`)}
                  >
                    Variance Report
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => navigate(`/payroll/global/runs/${runId}/employees`)}
                  >
                    Employee Details
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={() => navigate(`/payroll/global/runs/${runId}/compliance`)}
                  >
                    Compliance Report
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Description />}
                    onClick={() => navigate(`/payroll/global/runs/${runId}/audit`)}
                  >
                    Audit Trail
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: '', title: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{actionDialog.title}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This action will move the payroll run to the next stage. Please provide any relevant comments.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comments (Optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or notes for this action..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: '', title: '' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={executeAction}
            color={actionDialog.action === 'reject' ? 'error' : 'primary'}
          >
            {actionDialog.action === 'approve' ? 'Approve' : 
             actionDialog.action === 'reject' ? 'Reject' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}