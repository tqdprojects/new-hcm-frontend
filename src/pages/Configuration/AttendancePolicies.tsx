import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  CameraAlt,
  Schedule,
  Warning,
  CheckCircle,
  Save,
  Refresh,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import PermissionGuard from '../../components/Auth/PermissionGuard';

interface AttendancePolicyForm {
  graceTime: number;
  halfDayThreshold: number;
  overtimeThreshold: number;
  workingHours: {
    start: string;
    end: string;
    breakDuration: number;
  };
  locationTracking: boolean;
  selfieRequired: boolean;
  geofenceRadius: number;
  autoCheckout: boolean;
  autoCheckoutTime: string;
  weeklyOffDays: string[];
  holidayCalendar: boolean;
  flexibleTiming: boolean;
  shiftManagement: boolean;
}

export default function AttendancePolicies() {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AttendancePolicyForm>({
    defaultValues: {
      graceTime: 15,
      halfDayThreshold: 4,
      overtimeThreshold: 8,
      workingHours: {
        start: '09:00',
        end: '18:00',
        breakDuration: 60,
      },
      locationTracking: true,
      selfieRequired: false,
      geofenceRadius: 100,
      autoCheckout: false,
      autoCheckoutTime: '19:00',
      weeklyOffDays: ['saturday', 'sunday'],
      holidayCalendar: true,
      flexibleTiming: false,
      shiftManagement: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: AttendancePolicyForm) => {
    console.log('Updating attendance policies:', data);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    reset();
    setIsEditing(false);
    setHasChanges(false);
  };

  const policyValidations = [
    {
      rule: 'Grace Time Configuration',
      status: watchedValues.graceTime >= 5 && watchedValues.graceTime <= 30 ? 'valid' : 'warning',
      message: watchedValues.graceTime >= 5 && watchedValues.graceTime <= 30 
        ? 'Grace time is within recommended range (5-30 minutes)'
        : 'Grace time should be between 5-30 minutes for optimal policy enforcement'
    },
    {
      rule: 'Working Hours Setup',
      status: 'valid',
      message: 'Standard 9-hour working day with 1-hour break configured'
    },
    {
      rule: 'Location Tracking',
      status: watchedValues.locationTracking ? 'valid' : 'info',
      message: watchedValues.locationTracking 
        ? 'Location tracking enabled for attendance verification'
        : 'Location tracking disabled - consider enabling for better accuracy'
    },
    {
      rule: 'Overtime Policy',
      status: watchedValues.overtimeThreshold === 8 ? 'valid' : 'warning',
      message: watchedValues.overtimeThreshold === 8
        ? 'Standard 8-hour overtime threshold configured'
        : 'Non-standard overtime threshold - ensure compliance with labor laws'
    },
  ];

  return (
    <PermissionGuard module="configuration" action="read" showError>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Attendance Policies
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure attendance tracking rules and policies
            </Typography>
          </Box>
          
          <PermissionGuard module="configuration" action="update">
            <Box sx={{ display: 'flex', gap: 2 }}>
              {hasChanges && (
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
              <Button
                variant={isEditing ? 'contained' : 'outlined'}
                startIcon={isEditing ? <Save /> : <AccessTime />}
                onClick={() => {
                  if (isEditing) {
                    handleSubmit(onSubmit)();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Policies'}
              </Button>
            </Box>
          </PermissionGuard>
        </Box>

        {/* Policy Validation */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Policy Validation
            </Typography>
            <List>
              {policyValidations.map((validation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {validation.status === 'valid' ? (
                      <CheckCircle color="success" />
                    ) : validation.status === 'warning' ? (
                      <Warning color="warning" />
                    ) : (
                      <CheckCircle color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={validation.rule}
                    secondary={validation.message}
                  />
                  <Chip
                    label={validation.status}
                    size="small"
                    color={
                      validation.status === 'valid' ? 'success' :
                      validation.status === 'warning' ? 'warning' : 'info'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Attendance Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Basic Attendance Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      
                      <Controller
                        name="graceTime"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Grace Time (minutes)"
                            type="number"
                            disabled={!isEditing}
                            inputProps={{ min: 0, max: 60 }}
                            helperText="Late arrival tolerance period"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="halfDayThreshold"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Half Day Threshold (hours)"
                            type="number"
                            disabled={!isEditing}
                            inputProps={{ min: 1, max: 8, step: 0.5 }}
                            helperText="Minimum hours for half day"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="overtimeThreshold"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Overtime Threshold (hours)"
                            type="number"
                            disabled={!isEditing}
                            inputProps={{ min: 6, max: 12, step: 0.5 }}
                            helperText="Hours after which overtime applies"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Working Hours */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Working Hours Configuration
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="workingHours.start"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Start Time"
                            type="time"
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="workingHours.end"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="End Time"
                            type="time"
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="workingHours.breakDuration"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Break Duration (minutes)"
                            type="number"
                            disabled={!isEditing}
                            inputProps={{ min: 0, max: 120 }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Location & Security Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Location & Security Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="locationTracking"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn />
                                <Typography>Enable Location Tracking</Typography>
                              </Box>
                            }
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="selfieRequired"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CameraAlt />
                                <Typography>Require Selfie for Check-in</Typography>
                              </Box>
                            }
                          />
                        )}
                      />
                    </Grid>
                    
                    {watchedValues.locationTracking && (
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="geofenceRadius"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Geofence Radius (meters)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 10, max: 1000 }}
                              helperText="Allowed distance from office location"
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Auto Checkout Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Auto Checkout Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="autoCheckout"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Schedule />
                                <Typography>Enable Auto Checkout</Typography>
                              </Box>
                            }
                          />
                        )}
                      />
                    </Grid>
                    
                    {watchedValues.autoCheckout && (
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="autoCheckoutTime"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Auto Checkout Time"
                              type="time"
                              disabled={!isEditing}
                              InputLabelProps={{ shrink: true }}
                              helperText="Automatic checkout time for employees"
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Advanced Features */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Advanced Features
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="flexibleTiming"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label="Enable Flexible Timing"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="shiftManagement"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label="Enable Shift Management"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="holidayCalendar"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                disabled={!isEditing}
                              />
                            }
                            label="Holiday Calendar Integration"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleReset}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
              >
                Save Policies
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </PermissionGuard>
  );
}