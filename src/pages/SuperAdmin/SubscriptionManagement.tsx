import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Block,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Business,
  Warning,
  Schedule,
  Download,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { 
  useSubscriptions, 
  useCreateSubscription, 
  useUpgradeSubscription,
  useSubscriptionPlans,
  useUsageAnalytics
} from '../../hooks/useSubscriptions';
import { format } from 'date-fns';

export default function SubscriptionManagement() {
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const { data: subscriptionsResponse, isLoading } = useSubscriptions({
    status: statusFilter || undefined,
    planType: planFilter || undefined,
  });
  const { data: plansResponse } = useSubscriptionPlans({ isActive: true });
  
  const createSubscription = useCreateSubscription();
  const upgradeSubscription = useUpgradeSubscription();

  const subscriptions = subscriptionsResponse?.data?.data || [];
  const plans = plansResponse?.data?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const subscriptionStats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    trialSubscriptions: subscriptions.filter(s => s.status === 'trial').length,
    monthlyRevenue: subscriptions.reduce((sum, s) => sum + (s.pricing?.totalAmount || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'past-due': return 'warning';
      case 'cancelled': return 'error';
      case 'expired': return 'error';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const columns: GridColDef[] = [
    {
      field: 'tenant',
      headerName: 'Organization',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {params.row.tenant?.companyName?.charAt(0) || 'T'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.row.tenant?.companyName || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.tenant?.domain || 'No domain'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'plan',
      headerName: 'Plan',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.row.plan?.name || 'Unknown Plan'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.billingCycle}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          color={getStatusColor(params.row.status) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'usage',
      headerName: 'Employee Usage',
      width: 150,
      renderCell: (params) => {
        const used = params.row.usage?.employees || 0;
        const limit = params.row.plan?.limits?.maxEmployees || 0;
        const percentage = getUsagePercentage(used, limit);
        
        return (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {used} / {limit === -1 ? '∞' : limit}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={getUsageColor(percentage) as any}
              sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              {percentage.toFixed(0)}% used
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'revenue',
      headerName: 'Monthly Revenue',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="success.main">
          ${params.row.pricing?.totalAmount?.toLocaleString() || '0'}
        </Typography>
      ),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 120,
      renderCell: (params) => format(new Date(params.row.endDate), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Upgrade/Downgrade">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setSelectedSubscription(params.row);
                setUpgradeDialog(true);
              }}
            >
              <TrendingUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Subscription">
            <IconButton size="small">
              <Edit />
            </IconButton>
          </Tooltip>
          {params.row.status === 'active' ? (
            <Tooltip title="Suspend">
              <IconButton size="small" color="error">
                <Block />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate">
              <IconButton size="small" color="success">
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const onSubmit = (data: any) => {
    console.log('Creating subscription:', data);
    setSubscriptionDialog(false);
    reset();
  };

  const handleUpgrade = async (data: any) => {
    if (!selectedSubscription) return;
    
    try {
      await upgradeSubscription.mutateAsync({
        id: selectedSubscription._id,
        newPlanId: data.newPlanId,
        effectiveDate: data.effectiveDate
      });
      setUpgradeDialog(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Subscription Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage tenant subscriptions and billing
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setSubscriptionDialog(true)}
          >
            Create Subscription
          </Button>
        </Box>
      </Box>

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
                    {subscriptionStats.totalSubscriptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Subscriptions
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
                    {subscriptionStats.activeSubscriptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Subscriptions
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
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {subscriptionStats.trialSubscriptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trial Subscriptions
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
                    ${subscriptionStats.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="trial">Trial</MenuItem>
                  <MenuItem value="past-due">Past Due</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Plan Type</InputLabel>
                <Select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  label="Plan Type"
                >
                  <MenuItem value="">All Plans</MenuItem>
                  <MenuItem value="starter">Starter</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setStatusFilter('');
                  setPlanFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={subscriptions}
              columns={columns}
              loading={isLoading}
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Create Subscription Dialog */}
      <Dialog
        open={subscriptionDialog}
        onClose={() => setSubscriptionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Subscription</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="tenantId"
                  control={control}
                  rules={{ required: 'Tenant is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tenantId}>
                      <InputLabel>Select Tenant</InputLabel>
                      <Select {...field} label="Select Tenant">
                        <MenuItem value="tenant1">TechCorp Solutions</MenuItem>
                        <MenuItem value="tenant2">Global Industries</MenuItem>
                        <MenuItem value="tenant3">StartupHub Inc</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="planId"
                  control={control}
                  rules={{ required: 'Plan is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.planId}>
                      <InputLabel>Subscription Plan</InputLabel>
                      <Select {...field} label="Subscription Plan">
                        {plans.map((plan) => (
                          <MenuItem key={plan._id} value={plan._id}>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {plan.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${plan.pricing.monthly}/month • {plan.limits.maxEmployees} employees
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="billingCycle"
                  control={control}
                  rules={{ required: 'Billing cycle is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.billingCycle}>
                      <InputLabel>Billing Cycle</InputLabel>
                      <Select {...field} label="Billing Cycle">
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly (Save 20%)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubscriptionDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createSubscription.isPending}
          >
            Create Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade/Downgrade Dialog */}
      <Dialog
        open={upgradeDialog}
        onClose={() => setUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change Subscription Plan
        </DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Current Plan: {selectedSubscription.plan?.name} 
                (${selectedSubscription.pricing?.totalAmount}/month)
              </Alert>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>New Plan</InputLabel>
                    <Select label="New Plan">
                      {plans
                        .filter(plan => plan._id !== selectedSubscription.planId)
                        .map((plan) => (
                          <MenuItem key={plan._id} value={plan._id}>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {plan.name} - ${plan.pricing.monthly}/month
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {plan.limits.maxEmployees} employees • {plan.limits.storageGB}GB storage
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <DatePicker
                    label="Effective Date"
                    value={new Date()}
                    onChange={() => {}}
                    slotProps={{
                      textField: { fullWidth: true }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleUpgrade({})}
            disabled={upgradeSubscription.isPending}
          >
            Change Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}