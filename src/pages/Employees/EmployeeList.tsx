import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import {
  Visibility,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import LiveDataTable from '../../components/RealTime/LiveDataTable';
import { format } from 'date-fns';

export default function EmployeeList() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canManageEmployees = hasPermission('employees', 'create');

  const columns: GridColDef[] = [
    {
      field: 'employee',
      headerName: 'Employee',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {params.row.personalDetails?.firstName?.charAt(0) || 'U'}
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.row.personalDetails?.firstName} {params.row.personalDetails?.lastName}
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
      valueGetter: (params) => params.row.contactDetails?.email || '-',
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
      valueGetter: (params) => params.row.companyDetails?.department || '-',
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: 180,
      valueGetter: (params) => params.row.companyDetails?.designation || '-',
    },
    {
      field: 'joiningDate',
      headerName: 'Joining Date',
      width: 120,
      renderCell: (params) => 
        params.row.companyDetails?.joiningDate 
          ? format(new Date(params.row.companyDetails.joiningDate), 'MMM dd, yyyy')
          : '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          color={params.row.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
  ];

  const filters = [
    {
      key: 'department',
      label: 'Department',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'terminated', label: 'Terminated' },
        { value: 'on-leave', label: 'On Leave' },
      ],
    },
    {
      key: 'employmentType',
      label: 'Employment Type',
      options: [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' },
      ],
    },
  ];

  const actions = [
    {
      label: 'View Profile',
      icon: Visibility,
      onClick: (row: any) => navigate(`/employees/${row._id}`),
      color: 'primary' as const,
    },
    {
      label: 'Edit Employee',
      icon: Edit,
      onClick: (row: any) => navigate(`/employees/${row._id}/edit`),
      color: 'secondary' as const,
      show: () => canManageEmployees,
    },
    {
      label: 'Delete Employee',
      icon: Delete,
      onClick: (row: any) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
          console.log('Delete employee:', row._id);
        }
      },
      color: 'error' as const,
      show: () => canManageEmployees,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Employee Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your organization's workforce with real-time updates
          </Typography>
        </Box>
      </Box>

      {/* Live Data Table */}
      <LiveDataTable
        title="Employees"
        endpoint="/employees"
        queryKey={['employees']}
        columns={columns}
        realTimeEvents={[
          'employee:created',
          'employee:updated',
          'employee:status-changed',
          'employee:onboarding-completed'
        ]}
        filters={filters}
        actions={actions}
        onRowClick={(row) => navigate(`/employees/${row._id}`)}
        enableSearch
        enableExport={hasPermission('employees', 'export')}
        enableAdd={canManageEmployees}
        onAdd={() => navigate('/employees/add')}
        refreshInterval={60000} // Refresh every minute
      />
    </Box>
  );
}