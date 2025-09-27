import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import {
  Visibility,
  Edit,
  CheckCircle,
  Close,
  Cancel,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import LiveDataTable from '../../components/RealTime/LiveDataTable';
import { useLeaveRealTime } from '../../hooks/useRealTimeData';
import { format } from 'date-fns';

export default function LeaveList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();

  // Enable real-time updates for leaves
  useLeaveRealTime();

  const canManageLeaves = hasPermission('leaves', 'approve');
  const canApplyLeave = hasPermission('leaves', 'create');

  const columns: GridColDef[] = [
    {
      field: 'employee',
      headerName: 'Employee',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.employeeId?.personalDetails?.firstName} {params.row.employeeId?.personalDetails?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.employeeId?.employeeId}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'leaveType',
      headerName: 'Leave Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.leaveTypeId?.name || 'Unknown'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {format(new Date(params.row.startDate), 'MMM dd')} - {format(new Date(params.row.endDate), 'MMM dd')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.totalDays} day{params.row.totalDays !== 1 ? 's' : ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.row.reason}>
          {params.row.reason}
        </Typography>
      ),
    },
    {
      field: 'appliedDate',
      headerName: 'Applied Date',
      width: 120,
      renderCell: (params) => format(new Date(params.row.appliedDate), 'MMM dd, yyyy'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'cancelled': return 'default';
            case 'pending': default: return 'warning';
          }
        };

        return (
          <Chip
            label={params.row.status}
            color={getStatusColor(params.row.status) as any}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        );
      },
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      options: [
        { value: 'annual', label: 'Annual Leave' },
        { value: 'sick', label: 'Sick Leave' },
        { value: 'casual', label: 'Casual Leave' },
        { value: 'maternity', label: 'Maternity Leave' },
        { value: 'paternity', label: 'Paternity Leave' },
      ],
    },
  ];

  const actions = [
    {
      label: 'View Details',
      icon: Visibility,
      onClick: (row: any) => navigate(`/leaves/${row._id}`),
      color: 'primary' as const,
    },
    {
      label: 'Approve',
      icon: CheckCircle,
      onClick: (row: any) => {
        // Handle approval
        console.log('Approve leave:', row._id);
      },
      color: 'success' as const,
      show: (row: any) => canManageLeaves && row.status === 'pending',
    },
    {
      label: 'Reject',
      icon: Close,
      onClick: (row: any) => {
        // Handle rejection
        console.log('Reject leave:', row._id);
      },
      color: 'error' as const,
      show: (row: any) => canManageLeaves && row.status === 'pending',
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (row: any) => navigate(`/leaves/${row._id}/edit`),
      color: 'secondary' as const,
      show: (row: any) => user?.role === 'employee' && row.status === 'pending',
    },
    {
      label: 'Cancel',
      icon: Cancel,
      onClick: (row: any) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (reason) {
          console.log('Cancel leave:', row._id, reason);
        }
      },
      color: 'error' as const,
      show: (row: any) => user?.role === 'employee' && row.status === 'pending',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Leave Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {canManageLeaves ? 'Manage team leave requests with real-time updates' : 'View and manage your leave requests'}
          </Typography>
        </Box>
      </Box>

      {/* Live Data Table */}
      <LiveDataTable
        title="Leave Requests"
        endpoint="/leaves"
        queryKey={['leaves']}
        columns={columns}
        realTimeEvents={[
          'leave:applied',
          'leave:approved',
          'leave:rejected',
          'leave:cancelled',
          'leave:status-change'
        ]}
        filters={filters}
        actions={actions}
        onRowClick={(row) => navigate(`/leaves/${row._id}`)}
        enableSearch
        enableExport={hasPermission('leaves', 'export')}
        enableAdd={canApplyLeave}
        onAdd={() => navigate('/leaves/create')}
        refreshInterval={30000} // Refresh every 30 seconds
      />
    </Box>
  );
}