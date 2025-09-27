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
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Schedule,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';

interface GoalForm {
  title: string;
  description: string;
  metrics: string;
  weight: number;
  dueDate: string;
  assignedTo?: string;
  category: string;
  priority: string;
}

export default function GoalManagement() {
  const { user } = useAuthStore();
  const { hasPermission, isManager, isHR, isAdmin } = usePermissions();
  const [goalDialog, setGoalDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalForm>();

  const goals = [
    {
      id: '1',
      title: 'Increase Customer Satisfaction',
      description: 'Achieve 95% customer satisfaction rating through improved service delivery',
      metrics: 'Customer satisfaction score >= 95%',
      weight: 30,
      dueDate: '2024-12-31',
      assignedTo: 'John Doe',
      assignedBy: 'Manager',
      status: 'active',
      progress: 85,
      category: 'Customer Service',
      priority: 'high',
      evidence: 2,
      lastUpdated: '2024-12-01',
    },
    {
      id: '2',
      title: 'Complete Technical Training',
      description: 'Finish advanced React and Node.js certification program',
      metrics: 'Certification completion with score >= 80%',
      weight: 20,
      dueDate: '2024-12-15',
      assignedTo: 'John Doe',
      assignedBy: 'Manager',
      status: 'at-risk',
      progress: 60,
      category: 'Professional Development',
      priority: 'medium',
      evidence: 1,
      lastUpdated: '2024-11-28',
    },
    {
      id: '3',
      title: 'Lead Product Release',
      description: 'Successfully deliver Q4 product release on time and within budget',
      metrics: 'On-time delivery with quality score >= 90%',
      weight: 40,
      dueDate: '2024-12-20',
      assignedTo: 'John Doe',
      assignedBy: 'Manager',
      status: 'on-track',
      progress: 90,
      category: 'Project Management',
      priority: 'high',
      evidence: 5,
      lastUpdated: '2024-12-02',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'on-track': return 'success';
      case 'at-risk': return 'warning';
      case 'overdue': return 'error';
      case 'draft': return 'default';
      default: return 'info';
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

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Goal',
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.category}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
            {params.row.assignedTo.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {params.row.assignedTo}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.row.progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.row.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                bgcolor: params.row.progress >= 80 ? 'success.main' : 
                         params.row.progress >= 60 ? 'warning.main' : 'error.main',
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: 'weight',
      headerName: 'Weight',
      width: 80,
      renderCell: (params) => `${params.row.weight}%`,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status.replace('-', ' ')}
          size="small"
          color={getStatusColor(params.row.status) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.priority}
          size="small"
          color={getPriorityColor(params.row.priority) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Goal">
            <IconButton size="small" onClick={() => handleEditGoal(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Goal">
            <IconButton size="small" color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    reset(goal);
    setGoalDialog(true);
  };

  const onSubmit = (data: GoalForm) => {
    console.log('Goal data:', data);
    setGoalDialog(false);
    setEditingGoal(null);
    reset();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Goal Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, assign, and track performance goals
          </Typography>
        </Box>
        
        <PermissionGuard module="performance" action="create">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingGoal(null);
              reset();
              setGoalDialog(true);
            }}
          >
            Create Goal
          </Button>
        </PermissionGuard>
      </Box>

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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-track">On Track</MenuItem>
                  <MenuItem value="at-risk">At Risk</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Goals Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={goals}
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

      {/* Create/Edit Goal Dialog */}
      <Dialog
        open={goalDialog}
        onClose={() => {
          setGoalDialog(false);
          setEditingGoal(null);
          reset();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Goal title is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Goal Title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
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

              <Grid item xs={12}>
                <Controller
                  name="metrics"
                  control={control}
                  rules={{ required: 'Success metrics are required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={2}
                      label="Success Metrics/KPIs"
                      error={!!errors.metrics}
                      helperText={errors.metrics?.message}
                      placeholder="Define measurable success criteria..."
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="weight"
                  control={control}
                  rules={{ 
                    required: 'Weight is required',
                    min: { value: 1, message: 'Weight must be at least 1%' },
                    max: { value: 100, message: 'Weight cannot exceed 100%' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Weight (%)"
                      inputProps={{ min: 1, max: 100 }}
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="dueDate"
                  control={control}
                  rules={{ required: 'Due date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Due Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dueDate}
                      helperText={errors.dueDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="Customer Service">Customer Service</MenuItem>
                        <MenuItem value="Professional Development">Professional Development</MenuItem>
                        <MenuItem value="Project Management">Project Management</MenuItem>
                        <MenuItem value="Sales & Revenue">Sales & Revenue</MenuItem>
                        <MenuItem value="Quality & Process">Quality & Process</MenuItem>
                        <MenuItem value="Leadership">Leadership</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.priority}>
                      <InputLabel>Priority</InputLabel>
                      <Select {...field} label="Priority">
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {user?.role !== 'employee' && (
                <Grid item xs={12}>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Assign To Employee</InputLabel>
                        <Select {...field} label="Assign To Employee">
                          <MenuItem value="John Doe">John Doe - Software Engineer</MenuItem>
                          <MenuItem value="Sarah Wilson">Sarah Wilson - Sales Manager</MenuItem>
                          <MenuItem value="Mike Johnson">Mike Johnson - Designer</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setGoalDialog(false);
            setEditingGoal(null);
            reset();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}