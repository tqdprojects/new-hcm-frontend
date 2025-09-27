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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  AttachMoney,
  Receipt,
  CheckCircle,
  Schedule,
  Warning,
  AccountBalance,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import { useRealTimeData } from '../../hooks/useRealTimeData';

export default function FinanceWorkflows() {
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [comments, setComments] = useState('');

  // Real-time workflow data
  const { data: workflowsData } = useRealTimeData({
    queryKeys: [['finance-workflows']],
    events: ['workflow:finance-update', 'approval:required'],
    endpoint: '/finance/workflows',
  });

  const activeWorkflows = [
    {
      id: '1',
      type: 'Payroll Approval',
      title: 'December 2024 Payroll - Engineering',
      amount: 890000,
      currency: 'USD',
      status: 'pending-approval',
      priority: 'high',
      submittedBy: 'HR Manager',
      submittedAt: '2024-12-03T10:00:00Z',
      dueDate: '2024-12-05T17:00:00Z',
      currentStep: 2,
      totalSteps: 3,
      steps: [
        { label: 'HR Review', status: 'completed', completedAt: '2024-12-03T09:30:00Z' },
        { label: 'Finance Approval', status: 'active', assignedTo: 'Finance Manager' },
        { label: 'Final Authorization', status: 'pending', assignedTo: 'CFO' },
      ],
    },
    {
      id: '2',
      type: 'Budget Approval',
      title: 'Q1 2025 Marketing Budget',
      amount: 250000,
      currency: 'USD',
      status: 'pending-review',
      priority: 'medium',
      submittedBy: 'Marketing Manager',
      submittedAt: '2024-12-02T14:30:00Z',
      dueDate: '2024-12-10T17:00:00Z',
      currentStep: 1,
      totalSteps: 2,
      steps: [
        { label: 'Finance Review', status: 'active', assignedTo: 'Finance Manager' },
        { label: 'Executive Approval', status: 'pending', assignedTo: 'CFO' },
      ],
    },
    {
      id: '3',
      type: 'Expense Reimbursement',
      title: 'Bulk Expense Reimbursement - Sales Team',
      amount: 15750,
      currency: 'USD',
      status: 'processing',
      priority: 'low',
      submittedBy: 'Sales Manager',
      submittedAt: '2024-12-01T11:15:00Z',
      dueDate: '2024-12-08T17:00:00Z',
      currentStep: 3,
      totalSteps: 3,
      steps: [
        { label: 'Manager Approval', status: 'completed', completedAt: '2024-12-01T16:00:00Z' },
        { label: 'Finance Review', status: 'completed', completedAt: '2024-12-02T10:30:00Z' },
        { label: 'Payment Processing', status: 'active', assignedTo: 'Finance Team' },
      ],
    },
  ];

  const financialSummary = {
    pendingApprovals: 12,
    totalAmount: 1155750,
    avgProcessingTime: 2.3,
    slaCompliance: 94.5,
  };

  const handleApproveWorkflow = async () => {
    console.log('Approving workflow:', selectedWorkflow.id, 'Comments:', comments);
    setApprovalDialog(false);
    setSelectedWorkflow(null);
    setComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending-approval': return 'warning';
      case 'processing': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'Payroll Approval': return <AttachMoney />;
      case 'Budget Approval': return <AccountBalance />;
      case 'Expense Reimbursement': return <Receipt />;
      default: return <Assessment />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Finance Workflows
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage financial approvals and processes
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {financialSummary.pendingApprovals}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Approvals
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
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${(financialSummary.totalAmount / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
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
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {financialSummary.avgProcessingTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Processing (days)
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {financialSummary.slaCompliance}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SLA Compliance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Workflows */}
      <Grid container spacing={3}>
        {activeWorkflows.map((workflow) => (
          <Grid item xs={12} key={workflow.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getWorkflowIcon(workflow.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {workflow.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {workflow.type} • Submitted by {workflow.submittedBy}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={workflow.status.replace('-', ' ')}
                          size="small"
                          color={getStatusColor(workflow.status) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Chip
                          label={workflow.priority}
                          size="small"
                          color={getPriorityColor(workflow.priority) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      ${workflow.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workflow.currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(workflow.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Stepper activeStep={workflow.currentStep - 1} sx={{ mb: 2 }}>
                  {workflow.steps.map((step, index) => (
                    <Step key={index}>
                      <StepLabel
                        StepIconComponent={() => (
                          step.status === 'completed' ? <CheckCircle color="success" /> :
                          step.status === 'active' ? <Schedule color="primary" /> :
                          <Schedule color="disabled" />
                        )}
                      >
                        <Typography variant="body2">
                          {step.label}
                        </Typography>
                        {step.assignedTo && (
                          <Typography variant="caption" color="text.secondary">
                            {step.assignedTo}
                          </Typography>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {workflow.status === 'pending-approval' && (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setApprovalDialog(true);
                      }}
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

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog}
        onClose={() => setApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Approve Workflow
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                You are about to approve "{selectedWorkflow.title}" for ${selectedWorkflow.amount.toLocaleString()}.
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Approval Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments for this approval..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApproveWorkflow}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}