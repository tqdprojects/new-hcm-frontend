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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  Add,
  PlayArrow,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Assessment,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';

export default function PayrollRuns() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedPayGroup, setSelectedPayGroup] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const payrollRuns = [
    {
      id: '1',
      runId: 'PR202412001',
      payGroup: 'Monthly Employees',
      period: 'December 2024',
      status: 'completed',
      employees: 2847,
      totalCost: 2450000,
      currency: 'USD',
      processedAt: '2024-12-01T10:00:00Z',
      approvedAt: '2024-12-01T14:30:00Z',
      cycleTime: 4.5,
    },
    {
      id: '2',
      runId: 'PR202412002',
      payGroup: 'Weekly Contractors',
      period: 'Week 49, 2024',
      status: 'pending-approval',
      employees: 125,
      totalCost: 180000,
      currency: 'USD',
      processedAt: '2024-12-02T09:00:00Z',
      cycleTime: 2.1,
    },
    {
      id: '3',
      runId: 'PR202412003',
      payGroup: 'Bi-weekly Staff',
      period: 'Dec 1-15, 2024',
      status: 'processing',
      employees: 450,
      totalCost: 0,
      currency: 'USD',
      processedAt: '2024-12-03T08:00:00Z',
      cycleTime: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending-approval': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending-approval': return <Warning />;
      case 'processing': return <PlayArrow />;
      case 'failed': return <Error />;
      default: return <Schedule />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'runId',
      headerName: 'Run ID',
      width: 130,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    { field: 'payGroup', headerName: 'Pay Group', width: 150 },
    { field: 'period', headerName: 'Period', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value.replace('-', ' ')}
          color={getStatusColor(params.value) as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'employees',
      headerName: 'Employees',
      width: 100,
      align: 'right',
      renderCell: (params) => params.value.toLocaleString(),
    },
    {
      field: 'totalCost',
      headerName: 'Total Cost',
      width: 120,
      align: 'right',
      renderCell: (params) => 
        params.value > 0 ? `$${params.value.toLocaleString()}` : '-',
    },
    {
      field: 'cycleTime',
      headerName: 'Cycle Time',
      width: 100,
      align: 'right',
      renderCell: (params) => 
        params.value > 0 ? `${params.value} days` : '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/payroll/global/runs/${params.row.runId}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const payrollSteps = [
    'Input Validation',
    'Gross Calculation',
    'Deductions & Taxes',
    'Net Pay Calculation',
    'Approval Workflow',
    'Finalization',
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Payroll Runs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor payroll processing cycles
          </Typography>
        </Box>
        
        <PermissionGuard module="payroll" action="process">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
          >
            Create New Run
          </Button>
        </PermissionGuard>
      </Box>

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
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="pending-approval">Pending Approval</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="">All Periods</MenuItem>
                  <MenuItem value="2024-12">December 2024</MenuItem>
                  <MenuItem value="2024-11">November 2024</MenuItem>
                  <MenuItem value="2024-10">October 2024</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setStatusFilter('');
                  setPeriodFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payroll Runs Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={payrollRuns}
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

      {/* Create Payroll Run Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Payroll Run</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Initialize a new payroll run for the selected pay group and period. 
            Ensure all input data is validated before proceeding.
          </Alert>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pay Group</InputLabel>
                <Select
                  value={selectedPayGroup}
                  onChange={(e) => setSelectedPayGroup(e.target.value)}
                  label="Pay Group"
                >
                  <MenuItem value="monthly-employees">Monthly Employees (2,847)</MenuItem>
                  <MenuItem value="weekly-contractors">Weekly Contractors (125)</MenuItem>
                  <MenuItem value="biweekly-staff">Bi-weekly Staff (450)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pay Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Pay Period"
                >
                  <MenuItem value="2024-12">December 2024</MenuItem>
                  <MenuItem value="2025-01">January 2025</MenuItem>
                  <MenuItem value="2025-02">February 2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payroll Processing Steps
              </Typography>
              <Stepper orientation="horizontal" sx={{ mt: 2 }}>
                {payrollSteps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedPayGroup || !selectedPeriod}
            onClick={() => {
              console.log('Creating payroll run:', { selectedPayGroup, selectedPeriod });
              setCreateDialog(false);
            }}
          >
            Initialize Run
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}