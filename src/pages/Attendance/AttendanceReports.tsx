import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Download,
  Assessment,
  TrendingUp,
  People,
  Schedule,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AttendanceReports() {
  const [reportType, setReportType] = useState('monthly');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const monthlyData = [
    { month: 'Jul', present: 94, absent: 6, late: 12 },
    { month: 'Aug', present: 96, absent: 4, late: 8 },
    { month: 'Sep', present: 92, absent: 8, late: 15 },
    { month: 'Oct', present: 95, absent: 5, late: 10 },
    { month: 'Nov', present: 97, absent: 3, late: 7 },
    { month: 'Dec', present: 93, absent: 7, late: 14 },
  ];

  const departmentData = [
    { department: 'Engineering', attendance: 94.5, employees: 120 },
    { department: 'Sales', attendance: 96.2, employees: 85 },
    { department: 'Marketing', attendance: 92.8, employees: 45 },
    { department: 'HR', attendance: 98.1, employees: 15 },
    { department: 'Finance', attendance: 95.7, employees: 25 },
  ];

  const summaryStats = [
    { title: 'Average Attendance', value: '94.5%', change: '+2.1%', color: 'success' },
    { title: 'Late Arrivals', value: '66', change: '-8.3%', color: 'warning' },
    { title: 'Absent Days', value: '33', change: '+1.2%', color: 'error' },
    { title: 'Work From Home', value: '142', change: '+15.4%', color: 'info' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Attendance Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive attendance analytics and insights
          </Typography>
        </Box>
        
        <Button
          variant="contained"
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
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="daily">Daily Report</MenuItem>
                  <MenuItem value="weekly">Weekly Report</MenuItem>
                  <MenuItem value="monthly">Monthly Report</MenuItem>
                  <MenuItem value="quarterly">Quarterly Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
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
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: `${stat.color}.main`,
                    color: 'white'
                  }}>
                    <Assessment />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                    >
                      {stat.change} from last month
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Attendance Trend (6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#4caf50"
                      strokeWidth={3}
                      name="Present %"
                    />
                    <Line
                      type="monotone"
                      dataKey="late"
                      stroke="#ff9800"
                      strokeWidth={2}
                      name="Late Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Department Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[85, 100]} />
                    <YAxis dataKey="department" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                    <Bar dataKey="attendance" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Summary Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Department-wise Summary
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Employees</TableCell>
                  <TableCell align="right">Attendance %</TableCell>
                  <TableCell align="right">Present Days</TableCell>
                  <TableCell align="right">Late Arrivals</TableCell>
                  <TableCell align="right">Absent Days</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentData.map((dept) => (
                  <TableRow key={dept.department} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {dept.department}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{dept.employees}</TableCell>
                    <TableCell align="right">{dept.attendance}%</TableCell>
                    <TableCell align="right">{Math.round(dept.employees * dept.attendance / 100)}</TableCell>
                    <TableCell align="right">{Math.round(dept.employees * 0.05)}</TableCell>
                    <TableCell align="right">{Math.round(dept.employees * (100 - dept.attendance) / 100)}</TableCell>
                    <TableCell>
                      <Chip
                        label={dept.attendance >= 95 ? 'Excellent' : dept.attendance >= 90 ? 'Good' : 'Needs Improvement'}
                        color={dept.attendance >= 95 ? 'success' : dept.attendance >= 90 ? 'warning' : 'error'}
                        size="small"
                      />
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