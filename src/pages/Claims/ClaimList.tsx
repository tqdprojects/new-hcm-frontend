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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  CheckCircle,
  Close,
  Download,
  FilterList,
  Receipt,
  AttachMoney,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { format } from 'date-fns';

export default function ClaimList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    claimId: string;
    action: 'approve' | 'reject';
  }>({ open: false, claimId: '', action: 'approve' });
  const [comments, setComments] = useState('');

  const canManageClaims = ['finance', 'hr', 'manager', 'tenant-admin'].includes(user?.role || '');
  const canSubmitClaims = ['employee', 'manager', 'hr'].includes(user?.role || '');

  // Mock data for demonstration
  const claims = [
    {
      id: '1',
      claimNumber: 'CLM001',
      employee: 'John Doe',
      employeeId: 'EMP001',
      type: 'Travel',
      amount: 1250,
      currency: 'USD',
      description: 'Client meeting travel expenses',
      expenseDate: '2024-12-01',
      submittedDate: '2024-12-02',
      status: 'pending',
      receipts: 3,
      approver: 'Finance Manager',
    },
    {
      id: '2',
      claimNumber: 'CLM002',
      employee: 'Sarah Wilson',
      employeeId: 'EMP002',
      type: 'Equipment',
      amount: 450,
      currency: 'USD',
      description: 'Office equipment purchase',
      expenseDate: '2024-11-30',
      submittedDate: '2024-12-01',
      status: 'approved',
      receipts: 2,
      approver: 'Finance Manager',
      approvedDate: '2024-12-02',
    },
    {
      id: '3',
      claimNumber: 'CLM003',
      employee: 'Mike Johnson',
      employeeId: 'EMP003',
      type: 'Training',
      amount: 850,
      currency: 'USD',
      description: 'Professional certification course',
      expenseDate: '2024-11-28',
      submittedDate: '2024-11-29',
      status: 'rejected',
      receipts: 1,
      approver: 'HR Manager',
      rejectedDate: '2024-11-30',
      rejectionReason: 'Training not pre-approved',
    },
  ];

  const handleApprovalAction = async () => {
    const { claimId, action } = approvalDialog;
    
    // Mock API call
    console.log(`${action}ing claim ${claimId} with comments:`, comments);
    
    addNotification({
      title: `Claim ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Expense claim ${claimId} has been ${action}d`,
      type: action === 'approve' ? 'success' : 'info'
    });
    
    setApprovalDialog({ open: false, claimId: '', action: 'approve' });
    setComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'paid':
        return 'info';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Close />;
      case 'paid':
        return <AttachMoney />;
      case 'pending':
      default:
        return <Schedule />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'claimNumber',
      headerName: 'Claim #',
      width: 100,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'employee',
      headerName: 'Employee',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
            {params.row.employee.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.employee}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.employeeId}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          ${params.row.amount.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'expenseDate',
      headerName: 'Expense Date',
      width: 120,
      renderCell: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/claims/${params.row.id}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          {params.row.status === 'pending' && canManageClaims && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => setApprovalDialog({
                    open: true,
                    claimId: params.row.id,
                    action: 'approve'
                  })}
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setApprovalDialog({
                    open: true,
                    claimId: params.row.id,
                    action: 'reject'
                  })}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {user?.role === 'employee' && params.row.status === 'pending' && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => navigate(`/claims/${params.row.id}/edit`)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const summaryStats = [
    {
      title: 'Total Claims',
      value: '24',
      subtitle: 'This year',
      color: 'primary',
      icon: Receipt,
    },
    {
      title: 'Approved Amount',
      value: '$3,450',
      subtitle: 'Reimbursed',
      color: 'success',
      icon: CheckCircle,
    },
    {
      title: 'Pending Amount',
      value: '$850',
      subtitle: 'Under review',
      color: 'warning',
      icon: Schedule,
    },
    {
      title: 'Available Limit',
      value: '$1,200',
      subtitle: 'Monthly limit',
      color: 'info',
      icon: AttachMoney,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Expense Claims
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {canManageClaims ? 'Manage and approve expense claims' : 'Submit and track your expense reimbursements'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              addNotification({
                title: 'Export Started',
                message: 'Claims report export has been initiated',
                type: 'info'
              });
            }}
          >
            Export
          </Button>
          {canSubmitClaims && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/claims/create')}
            >
              Submit Claim
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    <stat.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setStatusFilter('');
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={claims}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'grey.50',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog.open}
        onClose={() => setApprovalDialog({ open: false, claimId: '', action: 'approve' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'} Expense Claim
        </DialogTitle>
        <DialogContent>
          <Alert 
            severity={approvalDialog.action === 'approve' ? 'success' : 'warning'}
            sx={{ mb: 2 }}
          >
            Are you sure you want to {approvalDialog.action} this expense claim?
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={`${approvalDialog.action === 'approve' ? 'Approval' : 'Rejection'} Comments`}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={`Enter ${approvalDialog.action === 'approve' ? 'approval' : 'rejection'} comments...`}
            required={approvalDialog.action === 'reject'}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApprovalDialog({ open: false, claimId: '', action: 'approve' })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={approvalDialog.action === 'approve' ? 'success' : 'error'}
            onClick={handleApprovalAction}
            disabled={approvalDialog.action === 'reject' && !comments.trim()}
          >
            {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'} Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}