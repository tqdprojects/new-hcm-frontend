import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Visibility,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function TimesheetList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  const timesheetStats = [
    {
      title: 'This Month',
      value: '168h',
      subtitle: 'Total hours logged',
      color: 'primary',
      icon: Schedule,
    },
    {
      title: 'Approved',
      value: '152h',
      subtitle: 'Hours approved',
      color: 'success',
      icon: CheckCircle,
    },
    {
      title: 'Pending',
      value: '16h',
      subtitle: 'Awaiting approval',
      color: 'warning',
      icon: Warning,
    },
  ];

  const timesheets = [
    {
      id: '1',
      period: 'Week ending Dec 15, 2024',
      hours: 40,
      project: 'Customer Portal',
      submittedDate: '2024-12-16',
      status: 'approved',
    },
    {
      id: '2',
      period: 'Week ending Dec 8, 2024',
      hours: 42,
      project: 'Mobile App',
      submittedDate: '2024-12-09',
      status: 'pending',
    },
    {
      id: '3',
      period: 'Week ending Dec 1, 2024',
      hours: 38,
      project: 'Internal Tools',
      submittedDate: '2024-12-02',
      status: 'approved',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Warning />;
      case 'rejected': return <Error />;
      default: return <Schedule />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Timesheets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your submitted timesheets
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          onClick={() => navigate('/timesheets/create')}
        >
          Create Timesheet
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {timesheetStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: `${stat.color}.main`,
                    color: 'white'
                  }}>
                    <stat.icon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
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
                  <MenuItem value="current">Current Month</MenuItem>
                  <MenuItem value="last">Last Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Timesheets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Timesheets
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {timesheet.period}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {timesheet.hours} hours
                      </Typography>
                    </TableCell>
                    <TableCell>{timesheet.project}</TableCell>
                    <TableCell>{timesheet.submittedDate}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(timesheet.status)}
                        label={timesheet.status}
                        size="small"
                        color={getStatusColor(timesheet.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}