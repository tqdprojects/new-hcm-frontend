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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Download,
  Visibility,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Receipt,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

export default function Payslips() {
  const { user, employee } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const payslips = [
    {
      id: '1',
      period: 'December 2024',
      month: 12,
      year: 2024,
      grossPay: 8500,
      deductions: 1275,
      taxes: 1020,
      netPay: 6205,
      currency: 'USD',
      status: 'paid',
      payDate: '2024-12-31',
    },
    {
      id: '2',
      period: 'November 2024',
      month: 11,
      year: 2024,
      grossPay: 8500,
      deductions: 1275,
      taxes: 1020,
      netPay: 6205,
      currency: 'USD',
      status: 'paid',
      payDate: '2024-11-30',
    },
    {
      id: '3',
      period: 'October 2024',
      month: 10,
      year: 2024,
      grossPay: 8200,
      deductions: 1230,
      taxes: 984,
      netPay: 5986,
      currency: 'USD',
      status: 'paid',
      payDate: '2024-10-31',
    },
  ];

  const currentPayslip = payslips.find(p => p.month === selectedMonth && p.year === selectedYear);

  const earningsBreakdown = [
    { component: 'Basic Salary', amount: 5000, type: 'earning' },
    { component: 'House Rent Allowance', amount: 2500, type: 'earning' },
    { component: 'Transport Allowance', amount: 800, type: 'earning' },
    { component: 'Medical Allowance', amount: 200, type: 'earning' },
  ];

  const deductionsBreakdown = [
    { component: 'Provident Fund', amount: 600, type: 'deduction' },
    { component: 'Professional Tax', amount: 200, type: 'deduction' },
    { component: 'Health Insurance', amount: 475, type: 'deduction' },
  ];

  const taxBreakdown = [
    { component: 'Income Tax', amount: 1020, type: 'tax' },
  ];

  const ytdSummary = {
    grossPay: 98400,
    deductions: 14700,
    taxes: 11784,
    netPay: 71916,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Payslips
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and download your salary statements
          </Typography>
        </Box>
        
        {currentPayslip && (
          <Button
            variant="contained"
            startIcon={<Download />}
          >
            Download Payslip
          </Button>
        )}
      </Box>

      {/* Period Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                  label="Year"
                >
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2022}>2022</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value as number)}
                  label="Month"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Visibility />}
                disabled={!currentPayslip}
              >
                View Payslip
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {currentPayslip ? (
        <Grid container spacing={3}>
          {/* Payslip Summary */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Payslip for {currentPayslip.period}
                  </Typography>
                  <Chip
                    label={currentPayslip.status}
                    color="success"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                {/* Net Pay Highlight */}
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" fontWeight={700}>
                        ${currentPayslip.netPay.toLocaleString()}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Net Pay
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Paid on {currentPayslip.payDate}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Earnings */}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Earnings
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {earningsBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.component}</TableCell>
                          <TableCell align="right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: 'success.light' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Total Earnings</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${currentPayslip.grossPay.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Deductions */}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Deductions
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deductionsBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.component}</TableCell>
                          <TableCell align="right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {taxBreakdown.map((item, index) => (
                        <TableRow key={`tax-${index}`}>
                          <TableCell>{item.component}</TableCell>
                          <TableCell align="right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: 'error.light' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Total Deductions</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${(currentPayslip.deductions + currentPayslip.taxes).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* YTD Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Year-to-Date Summary
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Gross Pay</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${ytdSummary.grossPay.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Deductions</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${ytdSummary.deductions.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Taxes</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${ytdSummary.taxes.toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>Net Pay</Typography>
                    <Typography variant="subtitle1" fontWeight={600} color="success.main">
                      ${ytdSummary.netPay.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Recent Payslips
                </Typography>
                {payslips.slice(0, 6).map((payslip) => (
                  <Box
                    key={payslip.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {payslip.period}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${payslip.netPay.toLocaleString()}
                      </Typography>
                    </Box>
                    <Button size="small" startIcon={<Download />}>
                      Download
                    </Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'grey.100', width: 64, height: 64 }}>
              <Receipt sx={{ fontSize: 32, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No Payslip Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No payslip found for the selected period. Please select a different month or year.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}