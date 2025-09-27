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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Code,
  Calculate,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSalaryComponents, useCreateSalaryComponent, useUpdateSalaryComponent, useComponentCategories } from '../../hooks/usePayroll';
import PermissionGuard from '../../components/Auth/PermissionGuard';

const componentSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  code: z.string().min(1, 'Component code is required'),
  type: z.enum(['earning', 'deduction', 'contribution']),
  category: z.enum(['basic', 'allowance', 'deduction', 'tax', 'statutory']),
  calculationType: z.enum(['fixed', 'percentage', 'formula']),
  value: z.number().min(0, 'Value must be positive'),
  baseComponent: z.string().optional(),
  formula: z.string().optional(),
  isTaxable: z.boolean(),
  isStatutory: z.boolean(),
  applicableRoles: z.array(z.string()),
  country: z.string().optional(),
  description: z.string().optional(),
});

type ComponentForm = z.infer<typeof componentSchema>;

export default function SalaryComponents() {
  const [componentDialog, setComponentDialog] = useState(false);
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: componentsResponse, isLoading } = useSalaryComponents({
    type: typeFilter || undefined,
    category: categoryFilter || undefined,
  });
  const { data: categoriesResponse } = useComponentCategories();
  const createComponent = useCreateSalaryComponent();
  const updateComponent = useUpdateSalaryComponent();

  const components = componentsResponse?.data?.data || [];
  const categories = categoriesResponse?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ComponentForm>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      isTaxable: true,
      isStatutory: false,
      applicableRoles: ['employee'],
    },
  });

  const watchedCalculationType = watch('calculationType');
  const watchedType = watch('type');

  const onSubmit = async (data: ComponentForm) => {
    try {
      if (editingComponent) {
        await updateComponent.mutateAsync({ id: editingComponent._id, data });
      } else {
        await createComponent.mutateAsync(data);
      }
      setComponentDialog(false);
      setEditingComponent(null);
      reset();
    } catch (error) {
      console.error('Component operation failed:', error);
    }
  };

  const handleEdit = (component: any) => {
    setEditingComponent(component);
    reset(component);
    setComponentDialog(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earning': return 'success';
      case 'deduction': return 'error';
      case 'contribution': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earning': return <TrendingUp />;
      case 'deduction': return <TrendingDown />;
      case 'contribution': return <AttachMoney />;
      default: return <AttachMoney />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Component Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.name}
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
          icon={getTypeIcon(params.value)}
          label={params.value}
          color={getTypeColor(params.value) as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'calculationType',
      headerName: 'Calculation',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value === 'formula' && <Code sx={{ fontSize: 16 }} />}
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.row.calculationType === 'percentage' ? `${params.value}%` : `$${params.value}`}
        </Typography>
      ),
    },
    {
      field: 'properties',
      headerName: 'Properties',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.row.isTaxable && (
            <Chip label="Taxable" size="small" color="warning" />
          )}
          {params.row.isStatutory && (
            <Chip label="Statutory" size="small" color="info" />
          )}
          {!params.row.isActive && (
            <Chip label="Inactive" size="small" color="default" />
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <PermissionGuard module="payroll" action="update">
          <Box>
            <Tooltip title="Edit Component">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Component">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this component?')) {
                    console.log('Delete component:', params.row._id);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </PermissionGuard>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Salary Components
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage salary components for payroll calculations
          </Typography>
        </Box>
        
        <PermissionGuard module="payroll" action="create">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingComponent(null);
              reset({
                isTaxable: true,
                isStatutory: false,
                applicableRoles: ['employee'],
              });
              setComponentDialog(true);
            }}
          >
            Add Component
          </Button>
        </PermissionGuard>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="earning">Earnings</MenuItem>
                  <MenuItem value="deduction">Deductions</MenuItem>
                  <MenuItem value="contribution">Contributions</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="allowance">Allowance</MenuItem>
                  <MenuItem value="deduction">Deduction</MenuItem>
                  <MenuItem value="tax">Tax</MenuItem>
                  <MenuItem value="statutory">Statutory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setTypeFilter('');
                  setCategoryFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Components Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={components}
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
            />
          </Box>
        </CardContent>
      </Card>

      {/* Component Dialog */}
      <Dialog
        open={componentDialog}
        onClose={() => {
          setComponentDialog(false);
          setEditingComponent(null);
          reset();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingComponent ? 'Edit' : 'Create'} Salary Component
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Component Name"
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
                      label="Component Code"
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
                      <InputLabel>Type</InputLabel>
                      <Select {...field} label="Type">
                        <MenuItem value="earning">Earning</MenuItem>
                        <MenuItem value="deduction">Deduction</MenuItem>
                        <MenuItem value="contribution">Contribution</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="basic">Basic</MenuItem>
                        <MenuItem value="allowance">Allowance</MenuItem>
                        <MenuItem value="deduction">Deduction</MenuItem>
                        <MenuItem value="tax">Tax</MenuItem>
                        <MenuItem value="statutory">Statutory</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="calculationType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.calculationType}>
                      <InputLabel>Calculation Type</InputLabel>
                      <Select {...field} label="Calculation Type">
                        <MenuItem value="fixed">Fixed Amount</MenuItem>
                        <MenuItem value="percentage">Percentage</MenuItem>
                        <MenuItem value="formula">Formula</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={watchedCalculationType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                      error={!!errors.value}
                      helperText={errors.value?.message}
                    />
                  )}
                />
              </Grid>

              {watchedCalculationType === 'percentage' && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name="baseComponent"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Base Component</InputLabel>
                        <Select {...field} label="Base Component">
                          <MenuItem value="basic-salary">Basic Salary</MenuItem>
                          <MenuItem value="gross-salary">Gross Salary</MenuItem>
                          <MenuItem value="total-earnings">Total Earnings</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {watchedCalculationType === 'formula' && (
                <Grid item xs={12}>
                  <Controller
                    name="formula"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Formula"
                        placeholder="e.g., (BASIC_SALARY * 0.12) + (HRA * 0.05)"
                        helperText="Use component codes in uppercase for calculations"
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      placeholder="Brief description of this component..."
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="isTaxable"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Taxable Component"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="isStatutory"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Statutory Component"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="applicableRoles"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Applicable Roles</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Applicable Roles"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="senior-manager">Senior Manager</MenuItem>
                        <MenuItem value="director">Director</MenuItem>
                        <MenuItem value="executive">Executive</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setComponentDialog(false);
            setEditingComponent(null);
            reset();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createComponent.isPending || updateComponent.isPending}
          >
            {editingComponent ? 'Update' : 'Create'} Component
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}