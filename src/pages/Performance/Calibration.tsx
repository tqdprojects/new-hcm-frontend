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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
} from '@mui/material';
import {
  Tune,
  Assessment,
  TrendingUp,
  People,
  Star,
  Edit,
  CheckCircle,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Calibration() {
  const [calibrationDialog, setCalibrationDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [adjustedRating, setAdjustedRating] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const calibrationData = [
    {
      id: '1',
      employee: 'John Doe',
      department: 'Engineering',
      manager: 'Jane Smith',
      selfRating: 4.2,
      managerRating: 3.8,
      suggestedRating: 4.0,
      finalRating: null,
      status: 'pending',
      variance: 0.4,
    },
    {
      id: '2',
      employee: 'Sarah Wilson',
      department: 'Sales',
      manager: 'Mike Johnson',
      selfRating: 3.5,
      managerRating: 4.2,
      suggestedRating: 3.9,
      finalRating: null,
      status: 'pending',
      variance: -0.7,
    },
    {
      id: '3',
      employee: 'Emily Chen',
      department: 'Marketing',
      manager: 'David Brown',
      selfRating: 4.8,
      managerRating: 4.5,
      suggestedRating: 4.6,
      finalRating: 4.6,
      status: 'calibrated',
      variance: 0.3,
    },
  ];

  const ratingDistribution = [
    { rating: '1.0-1.9', count: 2, percentage: 3.3 },
    { rating: '2.0-2.9', count: 8, percentage: 13.3 },
    { rating: '3.0-3.9', count: 25, percentage: 41.7 },
    { rating: '4.0-4.9', count: 20, percentage: 33.3 },
    { rating: '5.0', count: 5, percentage: 8.3 },
  ];

  const handleCalibrateEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setAdjustedRating(employee.suggestedRating);
    setCalibrationDialog(true);
  };

  const handleSaveCalibration = () => {
    console.log('Calibrating employee:', selectedEmployee.id, 'New rating:', adjustedRating, 'Reason:', adjustmentReason);
    setCalibrationDialog(false);
    setSelectedEmployee(null);
    setAdjustedRating(0);
    setAdjustmentReason('');
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) <= 0.3) return 'success';
    if (Math.abs(variance) <= 0.7) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calibrated': return 'success';
      case 'pending': return 'warning';
      case 'flagged': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Performance Calibration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ensure fair and consistent performance ratings across teams
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
          >
            Finalize Calibration
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main',
                  color: 'white'
                }}>
                  <People />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    60
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'warning.main',
                  color: 'white'
                }}>
                  <Tune />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    15
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Calibration
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'success.main',
                  color: 'white'
                }}>
                  <Star />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    3.8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'error.main',
                  color: 'white'
                }}>
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Variance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Rating Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Rating Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Bar dataKey="percentage" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calibration Table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Calibration Review
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="center">Self</TableCell>
                      <TableCell align="center">Manager</TableCell>
                      <TableCell align="center">Suggested</TableCell>
                      <TableCell align="center">Variance</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {calibrationData.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {row.employee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Manager: {row.manager}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell align="center">
                          <Rating value={row.selfRating} readOnly size="small" precision={0.1} />
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {row.selfRating}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Rating value={row.managerRating} readOnly size="small" precision={0.1} />
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {row.managerRating}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Rating value={row.suggestedRating} readOnly size="small" precision={0.1} />
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {row.suggestedRating}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.variance > 0 ? `+${row.variance}` : row.variance}
                            size="small"
                            color={getVarianceColor(row.variance) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          {row.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => handleCalibrateEmployee(row)}
                            >
                              Calibrate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calibration Dialog */}
      <Dialog
        open={calibrationDialog}
        onClose={() => setCalibrationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Calibrate Rating - {selectedEmployee?.employee}
        </DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Self Rating
                  </Typography>
                  <Rating value={selectedEmployee.selfRating} readOnly />
                  <Typography variant="caption">
                    {selectedEmployee.selfRating}/5.0
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Manager Rating
                  </Typography>
                  <Rating value={selectedEmployee.managerRating} readOnly />
                  <Typography variant="caption">
                    {selectedEmployee.managerRating}/5.0
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Calibrated Rating
                  </Typography>
                  <Rating
                    value={adjustedRating}
                    onChange={(_, value) => setAdjustedRating(value || 0)}
                    precision={0.1}
                    size="large"
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {adjustedRating}/5.0
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Calibration Reason"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Explain the reason for this calibration adjustment..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalibrationDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCalibration}
            disabled={!adjustmentReason.trim()}
          >
            Save Calibration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}