import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  AttachMoney,
  History,
  Assessment,
  Save,
} from '@mui/icons-material';
import { useEmployee } from '../../hooks/useEmployees';
import { useEmployeeSalary } from '../../hooks/usePayroll';
import EmployeeSalarySetup from './EmployeeSalarySetup';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EmployeeSalaryManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { data: employeeResponse, isLoading: employeeLoading } = useEmployee(id!);
  const { data: salaryResponse, isLoading: salaryLoading } = useEmployeeSalary(id!);

  const employee = employeeResponse?.data;
  const currentSalary = salaryResponse?.data;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock salary history data
  const salaryHistory = [
    {
      id: '1',
      effectiveDate: '2024-01-01',
      endDate: null,
      grossSalary: 85000,
      netSalary: 68000,
      currency: 'USD',
      reason: 'Annual increment',
      approvedBy: 'HR Manager',
      status: 'active',
    },
    {
      id: '2',
      effectiveDate: '2023-01-01',
      endDate: '2023-12-31',
      grossSalary: 80000,
      netSalary: 64000,
      currency: 'USD',
      reason: 'Initial salary',
      approvedBy: 'HR Manager',
      status: 'expired',
    },
  ];

  if (employeeLoading || salaryLoading) {
    return <LoadingSpinner message="Loading employee salary information..." />;
  }

  if (!employee) {
    return (
      <Alert severity="error">
        Employee not found. Please check the employee ID and try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/employees/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Profile
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Salary Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {employee.personalDetails?.firstName} {employee.personalDetails?.lastName} ({employee.employeeId})
          </Typography>
        </Box>
      </Box>

      {/* Employee Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80,
                fontSize: '2rem',
                bgcolor: 'primary.main'
              }}
              src={employee.personalDetails?.photoUrl}
            >
              {employee.personalDetails?.firstName?.charAt(0)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={600}>
                {employee.personalDetails?.firstName} {employee.personalDetails?.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {employee.companyDetails?.designation}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {employee.companyDetails?.department} • Joined: {employee.companyDetails?.joiningDate ? format(new Date(employee.companyDetails.joiningDate), 'MMM dd, yyyy') : 'Unknown'}
              </Typography>
            </Box>
            
            {currentSalary && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  ${currentSalary.grossSalary?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual Gross Salary
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Effective: {format(new Date(currentSalary.effectiveDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Salary Management Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Current Salary" />
            <Tab label="Salary History" />
            <Tab label="Salary Breakdown" />
          </Tabs>
        </Box>

        {/* Current Salary Tab */}
        <TabPanel value={tabValue} index={0}>
          <EmployeeSalarySetup
            employeeId={id!}
            onSave={() => {
              // Refresh data after save
              window.location.reload();
            }}
            onCancel={() => navigate(`/employees/${id}`)}
          />
        </TabPanel>

        {/* Salary History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Salary Change History
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Effective Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell align="right">Gross Salary</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryHistory.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      {format(new Date(record.effectiveDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {record.endDate ? format(new Date(record.endDate), 'MMM dd, yyyy') : 'Current'}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${record.grossSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${record.netSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{record.approvedBy}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        color={record.status === 'active' ? 'success' : 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Salary Breakdown Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Current Salary Breakdown
          </Typography>
          
          {currentSalary ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Earnings
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Basic Salary</TableCell>
                          <TableCell align="right">$50,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>House Rent Allowance</TableCell>
                          <TableCell align="right">$25,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transport Allowance</TableCell>
                          <TableCell align="right">$6,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Medical Allowance</TableCell>
                          <TableCell align="right">$4,000</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'success.light' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Total Earnings</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${currentSalary.grossSalary.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Deductions
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Provident Fund</TableCell>
                          <TableCell align="right">$6,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Professional Tax</TableCell>
                          <TableCell align="right">$2,400</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Health Insurance</TableCell>
                          <TableCell align="right">$3,600</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Income Tax</TableCell>
                          <TableCell align="right">$5,000</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'error.light' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Total Deductions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${(currentSalary.grossSalary - (currentSalary.netSalary || 0)).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={600}>
                      ${currentSalary.netSalary?.toLocaleString() || (currentSalary.grossSalary * 0.8).toLocaleString()}
                    </Typography>
                    <Typography variant="h6">
                      Monthly Net Salary
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      After all deductions and taxes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="warning">
              No salary information configured yet. Please set up the salary structure first.
            </Alert>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
}