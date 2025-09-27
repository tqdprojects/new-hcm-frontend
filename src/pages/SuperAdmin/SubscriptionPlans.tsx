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
  Switch,
  FormControlLabel,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  Star,
  ExpandMore,
  CheckCircle,
  Cancel,
  Visibility,
  TrendingUp,
  AttachMoney,
  People,
  Storage,
  Api,
  Security,
  Psychology,
  Public,
  Assessment,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useSubscriptionPlans, 
  useCreateSubscriptionPlan, 
  useUpdateSubscriptionPlan, 
  useDeleteSubscriptionPlan,
  useCloneSubscriptionPlan,
  useAvailableFeatures,
  usePlanAnalytics
} from '../../hooks/useSubscriptions';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const planSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters').max(100),
  code: z.string().min(2, 'Plan code must be at least 2 characters').max(20),
  description: z.string().max(500),
  type: z.enum(['starter', 'professional', 'enterprise', 'custom']),
  pricing: z.object({
    monthly: z.number().min(0, 'Monthly price must be positive'),
    yearly: z.number().min(0, 'Yearly price must be positive'),
    currency: z.string().default('USD'),
    billingCycle: z.enum(['monthly', 'yearly', 'both']),
    trialDays: z.number().min(0).max(365),
    setupFee: z.number().min(0).optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
  }),
  limits: z.object({
    maxEmployees: z.number().min(1, 'Must allow at least 1 employee'),
    maxAdmins: z.number().min(1, 'Must allow at least 1 admin'),
    maxBranches: z.number().min(1, 'Must allow at least 1 branch'),
    storageGB: z.number().min(1, 'Must provide at least 1GB storage'),
    apiCallsPerMonth: z.number().min(1000, 'Must allow at least 1000 API calls'),
    supportLevel: z.enum(['basic', 'standard', 'premium', 'enterprise']),
    customIntegrations: z.number().min(0),
    advancedReporting: z.boolean(),
    aiFeatures: z.boolean(),
    multiCurrency: z.boolean(),
    globalPayroll: z.boolean(),
  }),
  features: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    isIncluded: z.boolean(),
    limit: z.number().optional(),
    unit: z.string().optional(),
  })),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  displayOrder: z.number().min(0),
});

type PlanForm = z.infer<typeof planSchema>;

export default function SubscriptionPlans() {
  const [planDialog, setPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [cloneDialog, setCloneDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [cloneName, setCloneName] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: plansResponse, isLoading } = useSubscriptionPlans({
    type: typeFilter || undefined,
    isActive: statusFilter ? statusFilter === 'active' : undefined,
  });
  const { data: featuresResponse } = useAvailableFeatures();
  const { data: analyticsResponse } = usePlanAnalytics();
  
  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const deletePlan = useDeleteSubscriptionPlan();
  const clonePlan = useCloneSubscriptionPlan();

  const plans = plansResponse?.data?.data || [];
  const availableFeatures = featuresResponse?.data || [];
  const analytics = analyticsResponse?.data || {};

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      type: 'professional',
      pricing: {
        currency: 'USD',
        billingCycle: 'both',
        trialDays: 14,
      },
      limits: {
        maxEmployees: 100,
        maxAdmins: 5,
        maxBranches: 1,
        storageGB: 10,
        apiCallsPerMonth: 10000,
        supportLevel: 'standard',
        customIntegrations: 0,
        advancedReporting: false,
        aiFeatures: false,
        multiCurrency: false,
        globalPayroll: false,
      },
      features: [],
      isActive: true,
      isDefault: false,
      displayOrder: 0,
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
    update: updateFeature,
  } = useFieldArray({
    control,
    name: 'features',
  });

  const watchedType = watch('type');

  const onSubmit = async (data: PlanForm) => {
    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan._id, data });
      } else {
        await createPlan.mutateAsync(data);
      }
      setPlanDialog(false);
      setEditingPlan(null);
      reset();
    } catch (error) {
      console.error('Plan operation failed:', error);
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    reset(plan);
    setPlanDialog(true);
  };

  const handleClonePlan = async () => {
    if (!selectedPlan || !cloneName.trim()) return;
    
    try {
      await clonePlan.mutateAsync({ id: selectedPlan._id, name: cloneName });
      setCloneDialog(false);
      setSelectedPlan(null);
      setCloneName('');
    } catch (error) {
      console.error('Clone failed:', error);
    }
  };

  const handleDeletePlan = async (plan: any) => {
    if (window.confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
      await deletePlan.mutateAsync(plan._id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'starter': return 'info';
      case 'professional': return 'primary';
      case 'enterprise': return 'secondary';
      case 'custom': return 'warning';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Plan Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.name}
            {params.row.isDefault && (
              <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.code}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getTypeColor(params.value) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'pricing',
      headerName: 'Pricing',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            ${params.row.pricing.monthly}/mo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ${params.row.pricing.yearly}/yr
          </Typography>
        </Box>
      ),
    },
    {
      field: 'limits',
      headerName: 'Employee Limit',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.row.limits.maxEmployees === -1 ? 'Unlimited' : params.row.limits.maxEmployees}
        </Typography>
      ),
    },
    {
      field: 'features',
      headerName: 'Features',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.features?.length || 0} features
        </Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? 'Active' : 'Inactive'}
          size="small"
          color={params.row.isActive ? 'success' : 'default'}
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
            <IconButton size="small">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Plan">
            <IconButton
              size="small"
              onClick={() => handleEditPlan(params.row)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clone Plan">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedPlan(params.row);
                setCloneName(`${params.row.name} (Copy)`);
                setCloneDialog(true);
              }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Plan">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeletePlan(params.row)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const featureCategories = [
    { id: 'core', name: 'Core Features', icon: CheckCircle },
    { id: 'advanced', name: 'Advanced Features', icon: TrendingUp },
    { id: 'premium', name: 'Premium Features', icon: Star },
    { id: 'addon', name: 'Add-on Features', icon: Psychology },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Subscription Plans
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage subscription plans for tenants
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingPlan(null);
            reset();
            setPlanDialog(true);
          }}
        >
          Create Plan
        </Button>
      </Box>

      {/* Analytics Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main',
                  color: 'white'
                }}>
                  <Assessment />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.totalPlans || plans.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Plans
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
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'success.main',
                  color: 'white'
                }}>
                  <People />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.totalSubscriptions || 247}
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
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'secondary.main',
                  color: 'white'
                }}>
                  <AttachMoney />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${analytics.monthlyRevenue?.toLocaleString() || '892K'}
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
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'warning.main',
                  color: 'white'
                }}>
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.growthRate || '15.7'}%
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
                <InputLabel>Plan Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Plan Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="starter">Starter</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setTypeFilter('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={plans}
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

      {/* Create/Edit Plan Dialog */}
      <Dialog
        open={planDialog}
        onClose={() => {
          setPlanDialog(false);
          setEditingPlan(null);
          reset();
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Plan Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Plan Code"
                      error={!!errors.code}
                      helperText={errors.code?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Plan Type</InputLabel>
                      <Select {...field} label="Plan Type">
                        <MenuItem value="starter">Starter</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="enterprise">Enterprise</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="displayOrder"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Display Order"
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              {/* Pricing */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Pricing Configuration
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="pricing.monthly"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Monthly Price"
                      InputProps={{ startAdornment: '$' }}
                      error={!!errors.pricing?.monthly}
                      helperText={errors.pricing?.monthly?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="pricing.yearly"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Yearly Price"
                      InputProps={{ startAdornment: '$' }}
                      error={!!errors.pricing?.yearly}
                      helperText={errors.pricing?.yearly?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="pricing.trialDays"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Trial Days"
                      inputProps={{ min: 0, max: 365 }}
                      error={!!errors.pricing?.trialDays}
                      helperText={errors.pricing?.trialDays?.message}
                    />
                  )}
                />
              </Grid>

              {/* Limits */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Plan Limits
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="limits.maxEmployees"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Max Employees"
                      inputProps={{ min: 1 }}
                      error={!!errors.limits?.maxEmployees}
                      helperText={errors.limits?.maxEmployees?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="limits.maxAdmins"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Max Admins"
                      inputProps={{ min: 1 }}
                      error={!!errors.limits?.maxAdmins}
                      helperText={errors.limits?.maxAdmins?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="limits.storageGB"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Storage (GB)"
                      inputProps={{ min: 1 }}
                      error={!!errors.limits?.storageGB}
                      helperText={errors.limits?.storageGB?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.apiCallsPerMonth"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="API Calls per Month"
                      inputProps={{ min: 1000 }}
                      error={!!errors.limits?.apiCallsPerMonth}
                      helperText={errors.limits?.apiCallsPerMonth?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.supportLevel"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Support Level</InputLabel>
                      <Select {...field} label="Support Level">
                        <MenuItem value="basic">Basic Support</MenuItem>
                        <MenuItem value="standard">Standard Support</MenuItem>
                        <MenuItem value="premium">Premium Support</MenuItem>
                        <MenuItem value="enterprise">Enterprise Support</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Advanced Features */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Advanced Features
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.advancedReporting"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Advanced Reporting"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.aiFeatures"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="AI Features"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.multiCurrency"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Multi-Currency Support"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="limits.globalPayroll"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Global Payroll"
                    />
                  )}
                />
              </Grid>

              {/* Features Selection */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Feature Selection
                </Typography>
                
                {featureCategories.map((category) => (
                  <Accordion key={category.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <category.icon />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {category.name}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {availableFeatures
                          .filter(feature => feature.category === category.id)
                          .map((feature, index) => (
                            <ListItem key={feature.id}>
                              <ListItemIcon>
                                <Checkbox
                                  checked={featureFields.some(f => f.id === feature.id && f.isIncluded)}
                                  onChange={(e) => {
                                    const existingIndex = featureFields.findIndex(f => f.id === feature.id);
                                    if (existingIndex >= 0) {
                                      updateFeature(existingIndex, {
                                        ...featureFields[existingIndex],
                                        isIncluded: e.target.checked
                                      });
                                    } else {
                                      appendFeature({
                                        id: feature.id,
                                        name: feature.name,
                                        description: feature.description,
                                        category: feature.category,
                                        isIncluded: e.target.checked,
                                        limit: feature.defaultLimit,
                                        unit: feature.unit,
                                      });
                                    }
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.name}
                                secondary={feature.description}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>

              {/* Plan Settings */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Plan Settings
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Active Plan"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="isDefault"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Default Plan"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPlanDialog(false);
            setEditingPlan(null);
            reset();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createPlan.isPending || updatePlan.isPending}
          >
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clone Plan Dialog */}
      <Dialog
        open={cloneDialog}
        onClose={() => setCloneDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Clone Subscription Plan</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Create a copy of "{selectedPlan?.name}" with a new name. All features and settings will be copied.
          </Alert>
          <TextField
            fullWidth
            label="New Plan Name"
            value={cloneName}
            onChange={(e) => setCloneName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloneDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClonePlan}
            disabled={!cloneName.trim() || clonePlan.isPending}
          >
            Clone Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}