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
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  LocationOn,
  Business,
  People,
  Settings,
  Analytics,
  Map,
  Schedule,
  AttachMoney,
  Security,
  Upload,
  Download,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  CloudUpload,
  GetApp,
  Assessment,
  PersonAdd,
  SwapHoriz,
  QrCode,
  Print,
  Email,
  Phone,
  Language,
  AccessTime,
  CalendarToday,
  AccountBalance,
  Work,
  Home,
  Store,
  LocalShipping,
  Factory,
  MedicalServices,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch, useBranchEmployees, useAssignEmployeeToBranch, useTransferEmployee, useBranchAnalytics } from '../../hooks/useBranches';
import { useEmployees } from '../../hooks/useEmployees';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import { useNotificationStore } from '../../stores/notificationStore';
import { format } from 'date-fns';

const branchSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters'),
  code: z.string().min(2, 'Branch code must be at least 2 characters').max(10, 'Code too long'),
  type: z.string().min(1, 'Branch type is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    landmark: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }).optional(),
  }),
  contactDetails: z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    fax: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
  headOfBranch: z.string().optional(),
  departments: z.array(z.string()).min(1, 'At least one department is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().min(1, 'Currency is required'),
  costCenter: z.string().optional(),
  budgetAllocation: z.number().min(0).optional(),
  operationalHours: z.object({
    monday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
    tuesday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
    wednesday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
    thursday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
    friday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
    saturday: z.object({ isOpen: z.boolean(),  openTime: z.string().optional(), closeTime: z.string().optional() }),
    sunday: z.object({ isOpen: z.boolean(), openTime: z.string().optional(), closeTime: z.string().optional() }),
  }),
  facilities: z.array(z.object({
    name: z.string(),
    type: z.string(),
    capacity: z.number().optional(),
    description: z.string().optional(),
  })).optional(),
  isActive: z.boolean().default(true),
  establishedDate: z.date().optional(),
  complianceCertifications: z.array(z.string()).optional(),
});

type BranchFormData = z.infer<typeof branchSchema>;

const branchTypes = [
  { value: 'headquarters', label: 'Headquarters', icon: <Business /> },
  { value: 'regional', label: 'Regional Office', icon: <AccountBalance /> },
  { value: 'branch', label: 'Branch Office', icon: <Work /> },
  { value: 'retail', label: 'Retail Store', icon: <Store /> },
  { value: 'warehouse', label: 'Warehouse', icon: <LocalShipping /> },
  { value: 'manufacturing', label: 'Manufacturing', icon: <Factory /> },
  { value: 'service', label: 'Service Center', icon: <MedicalServices /> },
  { value: 'remote', label: 'Remote Office', icon: <Home /> },
];

const departments = [
  'Human Resources', 'Finance', 'IT', 'Operations', 'Sales', 'Marketing',
  'Customer Service', 'Legal', 'Procurement', 'Quality Assurance',
  'Research & Development', 'Administration', 'Security', 'Maintenance'
];

const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+05:30', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00',
  'UTC+11:00', 'UTC+12:00'
];

const currencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD',
  'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'BRL'
];

const facilities = [
  { name: 'Conference Room', type: 'meeting' },
  { name: 'Training Room', type: 'training' },
  { name: 'Cafeteria', type: 'dining' },
  { name: 'Parking', type: 'parking' },
  { name: 'Gym', type: 'fitness' },
  { name: 'Medical Room', type: 'medical' },
  { name: 'Server Room', type: 'technical' },
  { name: 'Storage', type: 'storage' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`branch-tabpanel-${index}`}
      aria-labelledby={`branch-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BranchManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view' | 'assign' | 'transfer' | 'import' | 'export'>('create');
  const [selectedEmployees, setSelectedEmployees] = useState<GridRowSelectionModel>([]);
  const [bulkImportData, setBulkImportData] = useState<any[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const { data: employees = [] } = useEmployees();
  const { data: branchEmployees = [] } = useBranchEmployees(selectedBranch?.id);
  const { data: analytics } = useBranchAnalytics();
  
  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();
  const assignEmployeeMutation = useAssignEmployeeToBranch();
  const transferEmployeeMutation = useTransferEmployee();

  const { addNotification } = useNotificationStore();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      operationalHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        saturday: { isOpen: false, openTime: '', closeTime: '' },
        sunday: { isOpen: false, openTime: '', closeTime: '' },
      },
      isActive: true,
      departments: [],
      timezone: 'UTC+00:00',
      currency: 'USD',
    }
  });

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control,
    name: 'facilities'
  });

  const branchColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Branch Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {params.row.code}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.code}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => {
        const type = branchTypes.find(t => t.value === params.value);
        return (
          <Chip
            icon={type?.icon}
            label={type?.label || params.value}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
      valueGetter: (params) => `${params.row.address?.city}, ${params.row.address?.state}`,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'employeeCount',
      headerName: 'Employees',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'headOfBranch',
      headerName: 'Branch Head',
      width: 150,
      renderCell: (params) => {
        const head = employees.find(emp => emp.id === params.value);
        return head ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24 }}>
              {head.firstName?.[0]}
            </Avatar>
            <Typography variant="body2">
              {head.firstName} {head.lastName}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not assigned
          </Typography>
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'error'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewBranch(params.row)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Branch">
            <IconButton
              size="small"
              onClick={() => handleEditBranch(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Employees">
            <IconButton
              size="small"
              onClick={() => handleAssignEmployees(params.row)}
            >
              <PersonAdd fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Branch">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteBranch(params.row.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const employeeColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Employee',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.employeeId}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 150,
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
  ];

  const handleCreateBranch = () => {
    setDialogType('create');
    setSelectedBranch(null);
    reset();
    setDialogOpen(true);
  };

  const handleEditBranch = (branch: any) => {
    setDialogType('edit');
    setSelectedBranch(branch);
    reset(branch);
    setDialogOpen(true);
  };

  const handleViewBranch = (branch: any) => {
    setDialogType('view');
    setSelectedBranch(branch);
    setDialogOpen(true);
  };

  const handleAssignEmployees = (branch: any) => {
    setDialogType('assign');
    setSelectedBranch(branch);
    setDialogOpen(true);
  };

  const handleTransferEmployees = () => {
    setDialogType('transfer');
    setDialogOpen(true);
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranchMutation.mutateAsync(branchId);
        addNotification('Branch deleted successfully', 'success');
      } catch (error) {
        addNotification('Failed to delete branch', 'error');
      }
    }
  };

  const handleBulkImport = () => {
    setDialogType('import');
    setDialogOpen(true);
  };

  const handleBulkExport = () => {
    setDialogType('export');
    setDialogOpen(true);
  };

  const onSubmit = async (data: BranchFormData) => {
    try {
      if (dialogType === 'create') {
        await createBranchMutation.mutateAsync(data);
        addNotification('Branch created successfully', 'success');
      } else if (dialogType === 'edit') {
        await updateBranchMutation.mutateAsync({ id: selectedBranch.id, ...data });
        addNotification('Branch updated successfully', 'success');
      }
      setDialogOpen(false);
      reset();
    } catch (error) {
      addNotification('Operation failed', 'error');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {} as any);
          });
          setBulkImportData(data);
        } catch (error) {
          addNotification('Failed to parse CSV file', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const processBulkImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    for (let i = 0; i < bulkImportData.length; i++) {
      try {
        await createBranchMutation.mutateAsync(bulkImportData[i]);
        setImportProgress(((i + 1) / bulkImportData.length) * 100);
      } catch (error) {
        console.error(`Failed to import branch ${i + 1}:`, error);
      }
    }

    setIsImporting(false);
    addNotification(`Imported ${bulkImportData.length} branches`, 'success');
    setDialogOpen(false);
    setBulkImportData([]);
  };

  const exportBranches = () => {
    const csvContent = [
      ['Name', 'Code', 'Type', 'City', 'State', 'Country', 'Phone', 'Email', 'Status'].join(','),
      ...branches.map(branch => [
        branch.name,
        branch.code,
        branch.type,
        branch.address?.city,
        branch.address?.state,
        branch.address?.country,
        branch.contactDetails?.phone,
        branch.contactDetails?.email,
        branch.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `branches_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const reportData = {
      totalBranches: branches.length,
      activeBranches: branches.filter(b => b.isActive).length,
      branchTypes: branchTypes.map(type => ({
        type: type.label,
        count: branches.filter(b => b.type === type.value).length
      })),
      employeeDistribution: branches.map(branch => ({
        branch: branch.name,
        employees: branch.employeeCount || 0
      })),
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `branch_report_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <PermissionGuard permissions={['manage_branches']}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Branch Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={handleBulkImport}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleBulkExport}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={generateReport}
            >
              Report
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateBranch}
            >
              Add Branch
            </Button>
          </Box>
        </Box>

        <Card>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="All Branches" icon={<Business />} />
            <Tab label="Analytics" icon={<Analytics />} />
            <Tab label="Employee Assignment" icon={<People />} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <DataGrid
              rows={branches}
              columns={branchColumns}
              loading={branchesLoading}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={setSelectedEmployees}
              sx={{ height: 600 }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total Branches
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {branches.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main">
                      Active Branches
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {branches.filter(b => b.isActive).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="info.main">
                      Total Employees
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {branches.reduce((sum, b) => sum + (b.employeeCount || 0), 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="warning.main">
                      Branch Types
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {new Set(branches.map(b => b.type)).size}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Employee Assignment</Typography>
              <Button
                variant="contained"
                startIcon={<SwapHoriz />}
                onClick={handleTransferEmployees}
                disabled={selectedEmployees.length === 0}
              >
                Transfer Selected
              </Button>
            </Box>
            <DataGrid
              rows={employees}
              columns={employeeColumns}
              checkboxSelection
              onRowSelectionModelChange={setSelectedEmployees}
              sx={{ height: 500 }}
            />
          </TabPanel>
        </Card>

        {/* Branch Form Dialog */}
        <Dialog
          open={dialogOpen && ['create', 'edit'].includes(dialogType)}
          onClose={() => setDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {dialogType === 'create' ? 'Create New Branch' : 'Edit Branch'}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={3}>
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
                        label="Branch Name"
                        fullWidth
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
                        label="Branch Code"
                        fullWidth
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
                        <InputLabel>Branch Type</InputLabel>
                        <Select {...field} label="Branch Type">
                          {branchTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {type.icon}
                                {type.label}
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
                    name="headOfBranch"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={employees}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        renderInput={(params) => (
                          <TextField {...params} label="Head of Branch" />
                        )}
                        onChange={(_, value) => field.onChange(value?.id)}
                      />
                    )}
                  />
                </Grid>

                {/* Address Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address.street"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Street Address"
                        fullWidth
                        error={!!errors.address?.street}
                        helperText={errors.address?.street?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        error={!!errors.address?.city}
                        helperText={errors.address?.city?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="address.state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State/Province"
                        fullWidth
                        error={!!errors.address?.state}
                        helperText={errors.address?.state?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="address.country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Country"
                        fullWidth
                        error={!!errors.address?.country}
                        helperText={errors.address?.country?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address.postalCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Postal Code"
                        fullWidth
                        error={!!errors.address?.postalCode}
                        helperText={errors.address?.postalCode?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address.landmark"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Landmark (Optional)"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactDetails.phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.contactDetails?.phone}
                        helperText={errors.contactDetails?.phone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactDetails.email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email Address"
                        fullWidth
                        error={!!errors.contactDetails?.email}
                        helperText={errors.contactDetails?.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactDetails.fax"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Fax (Optional)"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactDetails.website"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Website (Optional)"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Departments */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Departments
                  </Typography>
                  <Controller
                    name="departments"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={departments}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Departments"
                            error={!!errors.departments}
                            helperText={errors.departments?.message}
                          />
                        )}
                        onChange={(_, value) => field.onChange(value)}
                      />
                    )}
                  />
                </Grid>

                {/* Operational Settings */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Operational Settings
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select {...field} label="Timezone">
                          {timezones.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                              {tz}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select {...field} label="Currency">
                          {currencies.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                              {currency}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Operational Hours */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Operational Hours
                  </Typography>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography sx={{ minWidth: 100, textTransform: 'capitalize' }}>
                        {day}
                      </Typography>
                      <Controller
                        name={`operationalHours.${day}.isOpen` as any}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value}
                          />
                        )}
                      />
                      {watch(`operationalHours.${day}.isOpen` as any) && (
                        <>
                          <Controller
                            name={`operationalHours.${day}.openTime` as any}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="time"
                                label="Open"
                                size="small"
                                sx={{ width: 120 }}
                              />
                            )}
                          />
                          <Controller
                            name={`operationalHours.${day}.closeTime` as any}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="time"
                                label="Close"
                                size="small"
                                sx={{ width: 120 }}
                              />
                            )}
                          />
                        </>
                      )}
                    </Box>
                  ))}
                </Grid>

                {/* Facilities */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Facilities
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={() => appendFacility({ name: '', type: '', capacity: 0, description: '' })}
                    >
                      Add Facility
                    </Button>
                  </Box>
                  {facilityFields.map((field, index) => (
                    <Box key={field.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <Controller
                        name={`facilities.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Facility Name"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        )}
                      />
                      <Controller
                        name={`facilities.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Type</InputLabel>
                            <Select {...field} label="Type">
                              {facilities.map((fac) => (
                                <MenuItem key={fac.type} value={fac.type}>
                                  {fac.type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                      <Controller
                        name={`facilities.${index}.capacity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Capacity"
                            type="number"
                            size="small"
                            sx={{ width: 100 }}
                          />
                        )}
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeFacility(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Branch is Active"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {dialogType === 'create' ? 'Create Branch' : 'Update Branch'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog
          open={dialogOpen && dialogType === 'import'}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Bulk Import Branches</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Upload a CSV file with branch data. Required columns: name, code, type, city, state, country, phone, email
              </Alert>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Choose CSV File
                </Button>
              </label>
            </Box>

            {bulkImportData.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Preview ({bulkImportData.length} branches)
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bulkImportData.slice(0, 10).map((branch, index) => (
                        <TableRow key={index}>
                          <TableCell>{branch.name}</TableCell>
                          <TableCell>{branch.code}</TableCell>
                          <TableCell>{branch.type}</TableCell>
                          <TableCell>{branch.city}</TableCell>
                          <TableCell>
                            <Chip
                              label="Ready"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {bulkImportData.length > 10 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ... and {bulkImportData.length - 10} more branches
                  </Typography>
                )}
              </Box>
            )}

            {isImporting && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Importing branches... {Math.round(importProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={importProgress} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={isImporting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={processBulkImport}
              disabled={bulkImportData.length === 0 || isImporting}
              startIcon={<Upload />}
            >
              Import Branches
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog
          open={dialogOpen && dialogType === 'export'}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Export Branches</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Export all branch data to CSV format for backup or analysis.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Export will include: {branches.length} branches with complete details including address, contact information, and operational settings.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                exportBranches();
                setDialogOpen(false);
              }}
              startIcon={<GetApp />}
            >
              Export CSV
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  );
};

export default BranchManagement;