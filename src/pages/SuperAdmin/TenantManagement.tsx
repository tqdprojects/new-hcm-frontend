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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Block,
  CheckCircle,
  Business,
  People,
  AttachMoney,
  TrendingUp,
  Warning,
  Error,
  Analytics,
  Settings,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

export default function TenantManagement() {
  const [createDialog, setCreateDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mock data for demonstration
  const tenants = [
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      domain: 'techcorp',
      contactEmail: 'admin@techcorp.com',
      status: 'active',
      plan: 'enterprise',
      employees: 1250,
      maxEmployees: 2000,
      monthlyRevenue: 25000,
      utilizationRate: 62.5,
      lastActivity: '2024-12-03T10:30:00Z',
      createdAt: '2024-01-15T00:00:00Z',
      features: ['multi-branch', 'advanced-analytics', 'ai-features'],
    },
    {
      id: '2',
      companyName: 'StartupHub Inc',
      domain: 'startuphub',
      contactEmail: 'admin@startuphub.com',
      status: 'trial',
      plan: 'professional',
      employees: 45,
      maxEmployees: 100,
      monthlyRevenue: 0,
      utilizationRate: 45,
      lastActivity: '2024-12-03T09:15:00Z',
      createdAt: '2024-11-20T00:00:00Z',
      features: ['basic-analytics'],
    },
    {
      id: '3',
      companyName: 'Global Industries',
      domain: 'globalind',
      contactEmail: 'admin@globalind.com',
      status: 'suspended',
      plan: 'enterprise',
      employees: 850,
      maxEmployees: 1000,
      monthlyRevenue: 0,
      utilizationRate: 85,
      lastActivity: '2024-11-28T16:45:00Z',
      createdAt: '2024-03-10T00:00:00Z',
      features: ['multi-branch', 'advanced-analytics'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'suspended': return 'error';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'primary';
      case 'professional': return 'secondary';
      case 'starter': return 'info';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: 'Organization',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {params.row.companyName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.row.companyName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.domain}.vibhohcm.com
            </Typography>
          </Box>
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
      field: 'plan',
      headerName: 'Plan',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.plan}
          size="small"
          color={getPlanColor(params.row.plan) as any}
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'employees',
      headerName: 'Employees',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.row.employees} / {params.row.maxEmployees}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.row.utilizationRate}
            sx={{ 
              mt: 0.5, 
              height: 4, 
              borderRadius: 2,
              '& .MuiLinearProgress-bar': {
                bgcolor: params.row.utilizationRate > 80 ? 'error.main' : 
                         params.row.utilizationRate > 60 ? 'warning.main' : 'success.main'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {params.row.utilizationRate}% utilized
          </Typography>
        </Box>
      ),
    },
    {
      field: 'monthlyRevenue',
      headerName: 'Monthly Revenue',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="success.main">
          ${params.row.monthlyRevenue.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'lastActivity',
      headerName: 'Last Activity',
      width: 130,
      renderCell: (params) => format(new Date(params.row.lastActivity), 'MMM dd, HH:mm'),
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
              onClick={() => {
                setSelectedTenant(params.row);
                setDetailsDialog(true);
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Tenant">
            <IconButton size="small">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Analytics">
            <IconButton size="small" color="primary">
              <Analytics />
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
    console.log('Creating tenant:', data);
    setCreateDialog(false);
    reset();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Tenant Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all tenant organizations and their subscriptions
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          Add Tenant
        </Button>
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
                    247
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tenants
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
                    234
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Tenants
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
                    $892K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
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
                    15.7%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Growth Rate
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
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Plan</InputLabel>
                <Select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  label="Plan"
                >
                  <MenuItem value="">All Plans</MenuItem>
                  <MenuItem value="starter">Starter</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
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

      {/* Tenants Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={tenants}
              columns={columns}
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
                  cursor: 'pointer',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Create Tenant Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Tenant</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{ required: 'Company name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company Name"
                      error={!!errors.companyName}
                      helperText={errors.companyName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="domain"
                  control={control}
                  rules={{ required: 'Domain is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Domain"
                      error={!!errors.domain}
                      helperText={errors.domain?.message || 'Will be: domain.vibhohcm.com'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="contactEmail"
                  control={control}
                  rules={{ required: 'Contact email is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Email"
                      type="email"
                      error={!!errors.contactEmail}
                      helperText={errors.contactEmail?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="contactPhone"
                  control={control}
                  rules={{ required: 'Contact phone is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Phone"
                      error={!!errors.contactPhone}
                      helperText={errors.contactPhone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="plan"
                  control={control}
                  rules={{ required: 'Subscription plan is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.plan}>
                      <InputLabel>Subscription Plan</InputLabel>
                      <Select {...field} label="Subscription Plan">
                        <MenuItem value="starter">Starter - $5/user/month</MenuItem>
                        <MenuItem value="professional">Professional - $15/user/month</MenuItem>
                        <MenuItem value="enterprise">Enterprise - $25/user/month</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="maxEmployees"
                  control={control}
                  rules={{ required: 'Employee limit is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Employee Limit"
                      type="number"
                      error={!!errors.maxEmployees}
                      helperText={errors.maxEmployees?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Create Tenant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tenant Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Tenant Details - {selectedTenant?.companyName}
        </DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Company:</strong> {selectedTenant.companyName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Domain:</strong> {selectedTenant.domain}.vibhohcm.com
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contact:</strong> {selectedTenant.contactEmail}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created:</strong> {format(new Date(selectedTenant.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Subscription Details
                    </Typography>
                    <Typography variant="body2">
                      <strong>Plan:</strong> {selectedTenant.plan}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Employees:</strong> {selectedTenant.employees} / {selectedTenant.maxEmployees}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Monthly Revenue:</strong> ${selectedTenant.monthlyRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Features:</strong> {selectedTenant.features.join(', ')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Usage Analytics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight={600} color="primary.main">
                            {selectedTenant.employees}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Employees
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight={600} color="success.main">
                            94.5%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            System Uptime
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight={600} color="info.main">
                            2.1GB
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Storage Used
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight={600} color="warning.main">
                            15.2K
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            API Calls/Month
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Settings />}>
            Configure
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}