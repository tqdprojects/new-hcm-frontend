import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  LocationOn,
  CameraAlt,
  Home,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useRealTimeAttendance } from '../../hooks/useRealTimeAttendance';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';

export default function LiveAttendanceWidget() {
  const { employee } = useAuthStore();
  const {
    currentStatus,
    isConnected,
    checkIn,
    checkOut,
    isCheckingIn,
    isCheckingOut,
  } = useRealTimeAttendance();

  const [checkInDialog, setCheckInDialog] = useState(false);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [captureLocation, setCaptureLocation] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn({
        captureLocation: captureLocation && !workFromHome,
        workFromHome,
      });
      setCheckInDialog(false);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  const getStatusColor = () => {
    if (!currentStatus) return 'default';
    
    switch (currentStatus.status) {
      case 'checked-in': return 'success';
      case 'on-break': return 'warning';
      case 'checked-out': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    if (!currentStatus) return 'Not Checked In';
    
    switch (currentStatus.status) {
      case 'checked-in': return 'Checked In';
      case 'on-break': return 'On Break';
      case 'checked-out': return 'Checked Out';
      default: return 'Unknown Status';
    }
  };

  const calculateWorkedHours = () => {
    if (!currentStatus?.checkInTime) return '0h 0m';
    
    const checkInTime = new Date(currentStatus.checkInTime);
    const now = new Date();
    const diffMs = now.getTime() - checkInTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!currentStatus?.checkInTime) return 0;
    
    const checkInTime = new Date(currentStatus.checkInTime);
    const now = new Date();
    const diffMs = now.getTime() - checkInTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    return Math.min((hours / 8) * 100, 100); // 8-hour workday
  };

  return (
    <>
      <Card
        sx={{
          background: currentStatus?.status === 'checked-in' 
            ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent>
          {/* Connection Status */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Chip
              size="small"
              label={isConnected ? 'Live' : 'Offline'}
              color={isConnected ? 'success' : 'error'}
              sx={{ 
                bgcolor: isConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                color: 'white',
                border: `1px solid ${isConnected ? '#4caf50' : '#f44336'}`
              }}
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700}>
                  {format(currentTime, 'HH:mm')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {format(currentTime, 'EEEE, MMMM d')}
                </Typography>
                <Chip
                  label={getStatusText()}
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Hours Worked Today
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {calculateWorkedHours()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255,255,255,0.8)',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Target: 8h 0m
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                {currentStatus?.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                    <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Location Verified
                    </Box>
                  </Box>
                )}
                
                {!currentStatus?.status || currentStatus.status === 'checked-out' ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={isCheckingIn ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                    onClick={() => setCheckInDialog(true)}
                    disabled={isCheckingIn}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  >
                    {isCheckingIn ? 'Checking In...' : 'Check In'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : <Stop />}
                    onClick={handleCheckOut}
                    disabled={isCheckingOut}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                      '&:disabled': {
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  >
                    {isCheckingOut ? 'Checking Out...' : 'Check Out'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Real-time status indicator */}
          {currentStatus?.lastUpdate && (
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: 'center', mt: 2 }}>
              Last updated: {format(new Date(currentStatus.lastUpdate), 'HH:mm:ss')}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Check-in Options Dialog */}
      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)}>
        <DialogTitle>Check In Options</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={workFromHome}
                  onChange={(e) => setWorkFromHome(e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Home />
                  <Typography>Work From Home</Typography>
                </Box>
              }
            />
            
            {!workFromHome && (
              <FormControlLabel
                control={
                  <Switch
                    checked={captureLocation}
                    onChange={(e) => setCaptureLocation(e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    <Typography>Capture Location</Typography>
                  </Box>
                }
              />
            )}

            {workFromHome && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Work from home mode will skip location verification
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckIn}
            disabled={isCheckingIn}
            startIcon={isCheckingIn ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {isCheckingIn ? 'Checking In...' : 'Check In'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}