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
  FormControlLabel,
  Switch,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLeaveTypes, useLeaveBalance, useApplyLeave } from '../../hooks/useLeaves';
import { useAuthStore } from '../../stores/authStore';
import { leaveApplicationSchema, LeaveApplicationForm } from '../../types/forms';
import { differenceInDays, isWeekend, format } from 'date-fns';

const steps = ['Leave Details', 'Review & Submit'];

export default function LeaveApplication() {
  const navigate = useNavigate();
  const { user, employee } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [calculatedDays, setCalculatedDays] = useState(0);

  const { data: leaveTypesResponse } = useLeaveTypes();
  const { data: leaveBalanceResponse } = useLeaveBalance(employee?._id || '');
  const applyLeave = useApplyLeave();

  const leaveTypes = leaveTypesResponse?.data || [];
  const leaveBalances = leaveBalanceResponse?.data || {};

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<LeaveApplicationForm>({
    resolver: zodResolver(leaveApplicationSchema),
    defaultValues: {
      halfDay: false,
    },
  });

  const watchedValues = watch();
  const { startDate, endDate, halfDay, leaveTypeId } = watchedValues;

  // Calculate working days
  React.useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (halfDay) {
        setCalculatedDays(0.5);
      } else {
        let workingDays = 0;
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
          if (!isWeekend(currentDate)) {
            workingDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setCalculatedDays(workingDays);
      }
    }
  }, [startDate, endDate, halfDay]);

  const selectedLeaveType = leaveTypes.find(type => type._id === leaveTypeId);
  const selectedBalance = selectedLeaveType ? leaveBalances[selectedLeaveType.code] : null;

  const onSubmit = async (data: LeaveApplicationForm) => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      await applyLeave.mutateAsync({
        ...data,
        totalDays: calculatedDays,
      });
      navigate('/leaves');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="leaveTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.leaveTypeId}>
                    <InputLabel>Leave Type</InputLabel>
                    <Select {...field} label="Leave Type">
                      {leaveTypes.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{type.name}</span>
                            <span style={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {leaveBalances[type.code]?.available || 0} available
                            </span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="halfDay"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Half Day Leave"
                  />
                )}
              />
            </Grid>

            {!halfDay && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Start Date"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        minDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate?.message,
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="End Date"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        minDate={startDate ? new Date(startDate) : new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate?.message,
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {halfDay && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Leave Date"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          const dateStr = date?.toISOString().split('T')[0];
                          field.onChange(dateStr);
                          setValue('endDate', dateStr || '');
                        }}
                        minDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate?.message,
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="halfDayPeriod"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.halfDayPeriod}>
                        <InputLabel>Half Day Period</InputLabel>
                        <Select {...field} label="Half Day Period">
                          <MenuItem value="first-half">First Half (Morning)</MenuItem>
                          <MenuItem value="second-half">Second Half (Afternoon)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Reason for Leave"
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
                    placeholder="Please provide a detailed reason for your leave request..."
                  />
                )}
              />
            </Grid>

            {/* Leave Balance Summary */}
            {selectedBalance && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Leave Balance - {selectedLeaveType?.name}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Allocated
                        </Typography>
                        <Typography variant="h6" color="primary.main">
                          {selectedBalance.allocated}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Used
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {selectedBalance.used}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                          {selectedBalance.pending}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Available
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {selectedBalance.available}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Days Calculation */}
            {calculatedDays > 0 && (
              <Grid item xs={12}>
                <Alert 
                  severity={selectedBalance && calculatedDays > selectedBalance.available ? 'error' : 'info'}
                >
                  <Typography variant="body2">
                    <strong>Total Leave Days:</strong> {calculatedDays} day{calculatedDays !== 1 ? 's' : ''}
                    {selectedBalance && calculatedDays > selectedBalance.available && (
                      <span style={{ color: 'error.main' }}>
                        {' '}(Exceeds available balance of {selectedBalance.available} days)
                      </span>
                    )}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Leave Application
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Leave Type"
                  secondary={selectedLeaveType?.name}
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Duration"
                  secondary={
                    halfDay 
                      ? `${format(new Date(startDate), 'MMM dd, yyyy')} (${watchedValues.halfDayPeriod?.replace('-', ' ')})`
                      : `${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Total Days"
                  secondary={`${calculatedDays} day${calculatedDays !== 1 ? 's' : ''}`}
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Reason"
                  secondary={watchedValues.reason}
                />
              </ListItem>
            </List>

            {selectedBalance && (
              <Alert severity="info" sx={{ mt: 2 }}>
                After this leave, you will have {selectedBalance.available - calculatedDays} days remaining 
                for {selectedLeaveType?.name}.
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/leaves')}
          sx={{ mr: 2 }}
        >
          Back to Leaves
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Apply for Leave
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                startIcon={activeStep === steps.length - 1 ? <Send /> : undefined}
                disabled={
                  applyLeave.isPending || 
                  (selectedBalance && calculatedDays > selectedBalance.available)
                }
              >
                {activeStep === steps.length - 1 ? 'Submit Application' : 'Next'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}