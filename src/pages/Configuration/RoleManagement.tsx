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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  Alert,
} from '@mui/material';
import {
  Security,
  Edit,
  Add,
  People,
  Shield,
  Lock,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import {
  AttachMoney,
  Star,
  Work,
  Computer,
  Receipt,
  Description,
  Assessment,
  Psychology,
  Settings,
  Schedule,
} from '@mui/icons-material';

interface RolePermissionForm {
  role: string;
  module: string;
  actions: string[];
}

export default function RoleManagement() {
  const { isAdmin, isSuperAdmin } = usePermissions();
  const [permissionDialog, setPermissionDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RolePermissionForm>();

  // Mock permission data
  const rolePermissions = [
    {
      role: 'tenant-admin',
      label: 'Tenant Administrator',
      description: 'Full access to all tenant features',
      userCount: 2,
      permissions: {
        employees: ['create', 'read', 'update', 'delete', 'import', 'export'],
        payroll: ['create', 'read', 'update', 'approve', 'process'],
        performance: ['create', 'read', 'update', 'approve', 'calibrate'],
        recruitment: ['create', 'read', 'update', 'delete'],
        configuration: ['create', 'read', 'update', 'delete'],
        ai: ['read', 'analyze', 'configure']
      }
    },
    {
      role: 'hr',
      label: 'HR Manager',
      description: 'Human resources management access',
      userCount: 5,
      permissions: {
        employees: ['create', 'read', 'update', 'import'],
        payroll: ['create', 'read', 'update', 'process'],
        performance: ['create', 'read', 'update', 'approve', 'calibrate'],
        recruitment: ['create', 'read', 'update', 'delete'],
        documents: ['create', 'read', 'update', 'generate'],
        ai: ['read', 'analyze']
      }
    },
    {
      role: 'manager',
      label: 'Team Manager',
      description: 'Team management and approval access',
      userCount: 12,
      permissions: {
        employees: ['read'],
        leaves: ['read', 'approve', 'reject'],
        timesheets: ['read', 'approve', 'reject'],
        performance: ['create', 'read', 'update', 'approve'],
        claims: ['read', 'approve', 'reject'],
        ai: ['read', 'analyze']
      }
    },
    {
      role: 'employee',
      label: 'Employee',
      description: 'Self-service access only',
      userCount: 2847,
      permissions: {
        attendance: ['create', 'read', 'update'],
        leaves: ['create', 'read', 'update'],
        timesheets: ['create', 'read', 'update'],
        performance: ['read', 'update'],
        claims: ['create', 'read', 'update'],
        documents: ['read']
      }
    }
  ];

  const modules = [
    { id: 'employees', label: 'Employee Management', icon: People },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle },
    { id: 'leaves', label: 'Leave Management', icon: Cancel },
    { id: 'timesheets', label: 'Timesheets', icon: Schedule },
    { id: 'payroll', label: 'Payroll', icon: AttachMoney },
    { id: 'performance', label: 'Performance', icon: Star },
    { id: 'recruitment', label: 'Recruitment', icon: Work },
    { id: 'assets', label: 'Asset Management', icon: Computer },
    { id: 'claims', label: 'Claims & Expenses', icon: Receipt },
    { id: 'documents', label: 'Document Management', icon: Description },
    { id: 'reports', label: 'Reports & Analytics', icon: Assessment },
    { id: 'ai', label: 'AI Services', icon: Psychology },
    { id: 'configuration', label: 'Configuration', icon: Settings },
  ];

  const actions = [
    { id: 'create', label: 'Create', description: 'Create new records' },
    { id: 'read', label: 'Read', description: 'View and access records' },
    { id: 'update', label: 'Update', description: 'Modify existing records' },
    { id: 'delete', label: 'Delete', description: 'Remove records' },
    { id: 'approve', label: 'Approve', description: 'Approve requests and workflows' },
    { id: 'reject', label: 'Reject', description: 'Reject requests and workflows' },
    { id: 'export', label: 'Export', description: 'Export data and reports' },
    { id: 'import', label: 'Import', description: 'Import data from external sources' },
    { id: 'process', label: 'Process', description: 'Execute business processes' },
    { id: 'analyze', label: 'Analyze', description: 'Access AI analysis features' },
    { id: 'configure', label: 'Configure', description: 'Configure system settings' },
    { id: 'generate', label: 'Generate', description: 'Generate documents and reports' },
    { id: 'calibrate', label: 'Calibrate', description: 'Calibrate performance ratings' },
    { id: 'assign', label: 'Assign', description: 'Assign resources to users' },
  ];

  const onSubmit = (data: RolePermissionForm) => {
    console.log('Permission update:', data);
    setPermissionDialog(false);
    reset();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tenant-admin': return 'error';
      case 'hr': return 'warning';
      case 'manager': return 'info';
      case 'employee': return 'success';
      default: return 'default';
    }
  };

  return (
    <PermissionGuard module="configuration" action="read" showError>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Role & Permission Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure role-based access control for your organization
            </Typography>
          </Box>
          
          <PermissionGuard module="configuration" action="create">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setPermissionDialog(true)}
            >
              Add Permission
            </Button>
          </PermissionGuard>
        </Box>

        {/* Role Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {rolePermissions.map((roleData) => (
            <Grid item xs={12} md={6} lg={3} key={roleData.role}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Shield sx={{ color: `${getRoleColor(roleData.role)}.main` }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {roleData.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleData.userCount} users
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {roleData.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Object.keys(roleData.permissions).slice(0, 3).map((module) => (
                      <Chip
                        key={module}
                        label={module}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ))}
                    {Object.keys(roleData.permissions).length > 3 && (
                      <Chip
                        label={`+${Object.keys(roleData.permissions).length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Permission Matrix */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Permission Matrix
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell align="center">Tenant Admin</TableCell>
                    <TableCell align="center">HR</TableCell>
                    <TableCell align="center">Manager</TableCell>
                    <TableCell align="center">Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <module.icon sx={{ fontSize: 20 }} />
                          {module.label}
                        </Box>
                      </TableCell>
                      {['tenant-admin', 'hr', 'manager', 'employee'].map((role) => {
                        const roleData = rolePermissions.find(r => r.role === role);
                        const modulePerms = roleData?.permissions[module.id] || [];
                        
                        return (
                          <TableCell key={role} align="center">
                            {modulePerms.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                {modulePerms.slice(0, 2).map((action) => (
                                  <Chip
                                    key={action}
                                    label={action}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                ))}
                                {modulePerms.length > 2 && (
                                  <Chip
                                    label={`+${modulePerms.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                )}
                              </Box>
                            ) : (
                              <Typography variant="caption" color="text.disabled">
                                No Access
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Permission Dialog */}
        <Dialog
          open={permissionDialog}
          onClose={() => setPermissionDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Configure Role Permissions</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Role is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.role}>
                        <InputLabel>Role</InputLabel>
                        <Select {...field} label="Role">
                          <MenuItem value="tenant-admin">Tenant Administrator</MenuItem>
                          <MenuItem value="hr">HR Manager</MenuItem>
                          <MenuItem value="manager">Team Manager</MenuItem>
                          <MenuItem value="employee">Employee</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="module"
                    control={control}
                    rules={{ required: 'Module is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.module}>
                        <InputLabel>Module</InputLabel>
                        <Select {...field} label="Module">
                          {modules.map((module) => (
                            <MenuItem key={module.id} value={module.id}>
                              {module.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Allowed Actions
                  </Typography>
                  <FormGroup>
                    <Grid container spacing={1}>
                      {actions.map((action) => (
                        <Grid item xs={12} sm={6} md={4} key={action.id}>
                          <Controller
                            name="actions"
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value?.includes(action.id) || false}
                                    onChange={(e) => {
                                      const currentActions = field.value || [];
                                      if (e.target.checked) {
                                        field.onChange([...currentActions, action.id]);
                                      } else {
                                        field.onChange(currentActions.filter((a: string) => a !== action.id));
                                      }
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      {action.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {action.description}
                                    </Typography>
                                  </Box>
                                }
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPermissionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              Save Permissions
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  );
}