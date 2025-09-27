import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  ExitToApp,
  LocationOn,
  Schedule,
  AccessTime,
  Warning,
  Coffee,
  Home,
  Business,
} from '@mui/icons-material';
import { useRealTimeAttendance, useTeamAttendanceRealTime } from '../../hooks/useRealTimeAttendance';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';
import LiveAttendanceWidget from '../../components/RealTime/LiveAttendanceWidget';

export default function AttendanceTracker() {
  const { user, employee } = useAuthStore();
  const { currentStatus, isConnected } = useRealTimeAttendance();
  const { liveUpdates, canViewTeamAttendance } = useTeamAttendanceRealTime();
  
  const [regularizationDialog, setRegularizationDialog] = useState(false);
  const [regularizationReason, setRegularizationReason] = useState('');

  const todaySchedule = [
    { time: '09:00 AM', event: 'Work Start', type: 'work', status: 'completed' },
    { time: '10:30 AM', event: 'Team Standup', type: 'meeting', status: 'completed' },
    { time: '01:00 PM', event: 'Lunch Break', type: 'break', status: 'upcoming' },
    { time: '03:30 PM', event: 'Client Call', type: 'meeting', status: 'upcoming' },
    { time: '06:00 PM', event: 'Work End', type: 'work', status: 'upcoming' },
  ];

  const weeklyStats = {
    hoursWorked: 42.5,
    daysPresent: 5,
    lateArrivals: 1,
    earlyDepartures: 0,
    averageHours: 8.5,
    productivity: 94,
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Schedule />;
      case 'break': return <Coffee />;
      case 'work': return <Business />;
      default: return <AccessTime />;
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'upcoming': return 'info';
      case 'missed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Attendance Tracker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Real-time attendance tracking with live updates
      </Typography>

      {/* Live Attendance Widget */}
      <Box sx={{ mb: 3 }}>
        <LiveAttendanceWidget />
      </Box>

      <Grid container spacing={3}>
        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Today's Schedule
              </Typography>
              <List>
                {todaySchedule.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: item.type === 'meeting' ? 'primary.main' : 
                                   item.type === 'break' ? 'warning.main' : 'success.main',
                        }}
                      >
                        {getEventIcon(item.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.event}
                          </Typography>
                          <Chip
                            label={item.status}
                            size="small"
                            color={getEventColor(item.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={item.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                This Week Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight={600} color="primary.main">
                      {weeklyStats.hoursWorked}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hours Worked
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(weeklyStats.hoursWorked / 40) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      {weeklyStats.daysPresent}/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Present
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(weeklyStats.daysPresent / 5) * 100}
                      color="success"
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight={600} color="warning.main">
                      {weeklyStats.lateArrivals}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Late Arrivals
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight={600} color="info.main">
                      {weeklyStats.productivity}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Productivity
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Team Updates (for managers/HR) */}
        {canViewTeamAttendance && liveUpdates.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Live Team Updates
                  </Typography>
                  <Chip
                    label={`${liveUpdates.length} recent`}
                    size="small"
                    color="info"
                  />
                  <Chip
                    label={isConnected ? 'Live' : 'Offline'}
                    size="small"
                    color={isConnected ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                
                <List>
                  {liveUpdates.slice(0, 5).map((update, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {update.action === 'checkin' ? <CheckCircle /> : <ExitToApp />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{update.employeeName}</strong> {update.action === 'checkin' ? 'checked in' : 'checked out'}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(update.timestamp), 'HH:mm')}
                            </Typography>
                            {update.location && (
                              <Chip
                                icon={<LocationOn />}
                                label="Office"
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            {update.workFromHome && (
                              <Chip
                                icon={<Home />}
                                label="WFH"
                                size="small"
                                color="info"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Warning />}
                  onClick={() => setRegularizationDialog(true)}
                  fullWidth
                >
                  Request Regularization
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => navigate('/attendance/history')}
                  fullWidth
                >
                  View Attendance History
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccessTime />}
                  fullWidth
                >
                  Download Attendance Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regularization Dialog */}
      <Dialog
        open={regularizationDialog}
        onClose={() => setRegularizationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Attendance Regularization</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please provide a reason for attendance regularization. This request will be sent to your manager for approval.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Regularization"
            value={regularizationReason}
            onChange={(e) => setRegularizationReason(e.target.value)}
            placeholder="Please explain why you need attendance regularization..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegularizationDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Submit regularization request
              console.log('Regularization request:', regularizationReason);
              setRegularizationDialog(false);
              setRegularizationReason('');
            }}
            disabled={!regularizationReason.trim()}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}