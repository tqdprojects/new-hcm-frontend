import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Schedule,
  Download,
  FilterList,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAttendanceHistory } from '../../hooks/useAttendance';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';
import { AttendanceStatus } from '../../types/database';

export default function AttendanceHistory() {
  const { user, employee } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: attendanceResponse, isLoading } = useAttendanceHistory({
    employeeId: employee?._id,
    startDate: startDate?.toISOString().split('T')[0],
    endDate: endDate?.toISOString().split('T')[0],
    status: statusFilter || undefined,
  });

  const attendance = attendanceResponse?.data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'success';
      case AttendanceStatus.LATE:
        return 'warning';
      case AttendanceStatus.ABSENT:
        return 'error';
      case AttendanceStatus.HALF_DAY:
        return 'info';
      case AttendanceStatus.WORK_FROM_HOME:
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return <CheckCircle />;
      case AttendanceStatus.LATE:
        return <Warning />;
      case AttendanceStatus.ABSENT:
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => format(new Date(params.row.date), 'MMM dd, yyyy'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.row.status)}
          label={params.row.status.replace('-', ' ')}
          color={getStatusColor(params.row.status) as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'checkIn',
      headerName: 'Check In',
      width: 100,
      renderCell: (params) => 
        params.row.checkIn?.time ? format(new Date(params.row.checkIn.time), 'HH:mm') : '-',
    },
    {
      field: 'checkOut',
      headerName: 'Check Out',
      width: 100,
      renderCell: (params) => 
        params.row.checkOut?.time ? format(new Date(params.row.checkOut.time), 'HH:mm') : '-',
    },
    {
      field: 'totalHours',
      headerName: 'Total Hours',
      width: 100,
      renderCell: (params) => params.row.totalHours ? `${params.row.totalHours}h` : '-',
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      renderCell: (params) => params.row.checkIn?.location?.address || 'Office',
    },
    {
      field: 'regularization',
      headerName: 'Regularization',
      width: 120,
      renderCell: (params) => {
        if (!params.row.regularization) return '-';
        return (
          <Chip
            label={params.row.regularization.status}
            size="small"
            color={
              params.row.regularization.status === 'approved' ? 'success' :
              params.row.regularization.status === 'rejected' ? 'error' : 'warning'
            }
            sx={{ textTransform: 'capitalize' }}
          />
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Attendance History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your attendance records and track working hours
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
        >
          Export Report
        </Button>
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
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="half-day">Half Day</MenuItem>
                  <MenuItem value="work-from-home">Work From Home</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setStatusFilter('');
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={attendance}
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
    </Box>
  );
}