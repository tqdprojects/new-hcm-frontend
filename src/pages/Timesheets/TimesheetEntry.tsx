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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Send,
  Timer,
  PlayArrow,
  Stop,
  Save,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  useTimesheets, 
  useTimesheet, 
  useCreateTimesheet, 
  useAddTimesheetEntry, 
  useSubmitTimesheet,
  useProjects,
  useClients,
  useTasks
} from '../../hooks/useTimesheets';
import { useAuthStore } from '../../stores/authStore';
import { timesheetEntrySchema, TimesheetEntryForm } from '../../types/forms';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { TimesheetStatus } from '../../types/database';

export default function TimesheetEntry() {
  const { employee } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entryDialog, setEntryDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerHours, setTimerHours] = useState(0);

  const currentMonth = selectedDate.getMonth() + 1;
  const currentYear = selectedDate.getFullYear();

  const { data: timesheetsResponse } = useTimesheets({
    employeeId: employee?._id,
    month: currentMonth,
    year: currentYear,
  });

  const { data: projectsResponse } = useProjects('active');
  const { data: clientsResponse } = useClients(true);

  const createTimesheet = useCreateTimesheet();
  const addTimesheetEntry = useAddTimesheetEntry();
  const submitTimesheet = useSubmitTimesheet();

  const timesheets = timesheetsResponse?.data?.data || [];
  const currentTimesheet = timesheets[0]; // Assuming one timesheet per month
  const projects = projectsResponse?.data || [];
  const clients = clientsResponse?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TimesheetEntryForm>({
    resolver: zodResolver(timesheetEntrySchema),
    defaultValues: {
      billable: true,
    },
  });

  const watchedProjectId = watch('projectId');
  const { data: tasksResponse } = useTasks(watchedProjectId);
  const tasks = tasksResponse?.data || [];

  // Timer functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerStart) {
      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - timerStart.getTime();
        const hours = diffMs / (1000 * 60 * 60);
        setTimerHours(Math.round(hours * 100) / 100);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timerStart]);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStart(new Date());
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerHours > 0) {
      setEntryDialog(true);
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        hours: timerHours,
        description: '',
        billable: true,
      });
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerStart(null);
    setTimerHours(0);
  };

  const handleCreateTimesheet = async () => {
    await createTimesheet.mutateAsync({ month: currentMonth, year: currentYear });
  };

  const onSubmit = async (data: TimesheetEntryForm) => {
    if (!currentTimesheet) {
      await handleCreateTimesheet();
      return;
    }

    await addTimesheetEntry.mutateAsync({
      timesheetId: currentTimesheet._id,
      data: {
        ...data,
        date: data.date,
      }
    });

    setEntryDialog(false);
    setEditingEntry(null);
    reset();
    resetTimer();
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    reset({
      date: format(new Date(entry.date), 'yyyy-MM-dd'),
      projectId: entry.projectId?._id || '',
      taskId: entry.taskId?._id || '',
      clientId: entry.clientId?._id || '',
      hours: entry.hours,
      description: entry.description,
      billable: entry.billable,
    });
    setEntryDialog(true);
  };

  const handleSubmitTimesheet = async () => {
    if (!currentTimesheet) return;
    
    await submitTimesheet.mutateAsync({
      id: currentTimesheet._id,
      comments: 'Timesheet submitted for approval'
    });
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  const getEntryForDate = (date: Date) => {
    if (!currentTimesheet) return null;
    return currentTimesheet.entries.find(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const getTotalHoursForWeek = () => {
    if (!currentTimesheet) return 0;
    return weekDays.reduce((total, day) => {
      const entry = getEntryForDate(day);
      return total + (entry?.hours || 0);
    }, 0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Timesheet Entry
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your daily work hours and project activities
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Timer */}
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Timer color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {Math.floor(timerHours)}h {Math.floor((timerHours % 1) * 60)}m
              </Typography>
              {!isTimerRunning ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrow />}
                  onClick={startTimer}
                >
                  Start
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopTimer}
                  >
                    Stop
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetTimer}
                  >
                    Reset
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                hours: 0,
                description: '',
                billable: true,
              });
              setEntryDialog(true);
            }}
          >
            Add Entry
          </Button>
        </Box>
      </Box>

      {/* Month Navigation */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Select Month"
                views={['year', 'month']}
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="primary.main">
                  {getTotalHoursForWeek()}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Week
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {currentTimesheet?.totalHours || 0}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Timesheet Status */}
      {!currentTimesheet ? (
        <Alert 
          severity="info" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleCreateTimesheet}
              disabled={createTimesheet.isPending}
            >
              Create Timesheet
            </Button>
          }
          sx={{ mb: 3 }}
        >
          No timesheet found for {format(selectedDate, 'MMMM yyyy')}. Create one to start tracking time.
        </Alert>
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Timesheet for {format(selectedDate, 'MMMM yyyy')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    label={currentTimesheet.status}
                    color={
                      currentTimesheet.status === TimesheetStatus.APPROVED ? 'success' :
                      currentTimesheet.status === TimesheetStatus.SUBMITTED ? 'warning' :
                      currentTimesheet.status === TimesheetStatus.REJECTED ? 'error' : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Total: {currentTimesheet.totalHours} hours
                  </Typography>
                </Box>
              </Box>
              
              {currentTimesheet.status === TimesheetStatus.DRAFT && (
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubmitTimesheet}
                  disabled={currentTimesheet.entries.length === 0 || submitTimesheet.isPending}
                >
                  Submit for Approval
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Weekly View */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Weekly View - {format(weekDays[0], 'MMM dd')} to {format(weekDays[6], 'MMM dd')}
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Billable</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekDays.map((day) => {
                  const entry = getEntryForDate(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <TableRow 
                      key={day.toISOString()}
                      sx={{ 
                        bgcolor: isToday ? 'action.hover' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={isToday ? 600 : 400}>
                            {format(day, 'EEE, MMM dd')}
                          </Typography>
                          {isToday && (
                            <Chip label="Today" size="small" color="primary" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {entry?.projectId?.name || '-'}
                      </TableCell>
                      <TableCell>
                        {entry?.taskId?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {entry?.hours || 0}h
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {entry?.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {entry && (
                          <Chip
                            label={entry.billable ? 'Billable' : 'Non-billable'}
                            size="small"
                            color={entry.billable ? 'success' : 'default'}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {entry ? (
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleEditEntry(entry)}
                              disabled={currentTimesheet?.status !== TimesheetStatus.DRAFT}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={currentTimesheet?.status !== TimesheetStatus.DRAFT}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => {
                              reset({
                                date: format(day, 'yyyy-MM-dd'),
                                hours: timerHours > 0 ? timerHours : 0,
                                description: '',
                                billable: true,
                              });
                              setEntryDialog(true);
                            }}
                            disabled={!currentTimesheet || currentTimesheet.status !== TimesheetStatus.DRAFT}
                          >
                            <Add />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Entry Dialog */}
      <Dialog
        open={entryDialog}
        onClose={() => {
          setEntryDialog(false);
          setEditingEntry(null);
          reset();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEntry ? 'Edit' : 'Add'} Timesheet Entry
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="hours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hours"
                      type="number"
                      inputProps={{ min: 0.5, max: 24, step: 0.5 }}
                      error={!!errors.hours}
                      helperText={errors.hours?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Client (Optional)</InputLabel>
                      <Select {...field} label="Client (Optional)">
                        <MenuItem value="">No Client</MenuItem>
                        {clients.map((client) => (
                          <MenuItem key={client._id} value={client._id}>
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Project (Optional)</InputLabel>
                      <Select {...field} label="Project (Optional)">
                        <MenuItem value="">No Project</MenuItem>
                        {projects.map((project) => (
                          <MenuItem key={project._id} value={project._id}>
                            {project.name} ({project.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {watchedProjectId && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name="taskId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Task (Optional)</InputLabel>
                        <Select {...field} label="Task (Optional)">
                          <MenuItem value="">No Task</MenuItem>
                          {tasks.map((task) => (
                            <MenuItem key={task._id} value={task._id}>
                              {task.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Controller
                  name="billable"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Billable Hours"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Work Description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      placeholder="Describe the work performed during this time..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setEntryDialog(false);
              setEditingEntry(null);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={addTimesheetEntry.isPending}
          >
            {editingEntry ? 'Update' : 'Add'} Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}