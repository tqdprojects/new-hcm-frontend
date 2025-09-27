import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  BeachAccess,
  Home,
  LocalHospital,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';

export default function LeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock leave data
  const leaves = [
    {
      id: '1',
      employeeName: 'John Doe',
      startDate: '2024-12-15',
      endDate: '2024-12-15',
      type: 'WFH',
      status: 'approved',
    },
    {
      id: '2',
      employeeName: 'Sarah Wilson',
      startDate: '2024-12-25',
      endDate: '2024-12-26',
      type: 'AL',
      status: 'approved',
    },
  ];

  const upcomingLeaves = [
    {
      employee: 'John Doe',
      dates: 'Dec 15',
      type: 'Work From Home',
      typeCode: 'WFH',
      color: 'info',
    },
    {
      employee: 'Sarah Wilson',
      dates: 'Dec 25-26',
      type: 'Annual Leave',
      typeCode: 'AL',
      color: 'primary',
    },
  ];

  const leaveStats = [
    { label: 'Total Leaves This Month', value: '18' },
    { label: 'Approved', value: '15', color: 'success' },
    { label: 'Pending', value: '3', color: 'warning' },
    { label: 'Team Availability', value: '94%', color: 'info' },
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDayLeaves = (date: Date) => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'AL': return 'primary';
      case 'SL': return 'error';
      case 'CL': return 'info';
      case 'WFH': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Leave Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View team leave schedules and plan accordingly
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft />
              </Button>
              <Typography variant="h5" fontWeight={600}>
                {format(currentDate, 'MMMM yyyy')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight />
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Today />}
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <FormControl size="small">
                <InputLabel>View</InputLabel>
                <Select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  label="View"
                >
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Calendar Grid */}
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Box sx={{ textAlign: 'center', py: 1, fontWeight: 600, color: 'text.secondary' }}>
                  {day}
                </Box>
              </Grid>
            ))}
            
            {/* Calendar days */}
            {Array.from({ length: 42 }, (_, index) => {
              const dayIndex = index - getDay(monthStart);
              const date = new Date(monthStart);
              date.setDate(date.getDate() + dayIndex);
              
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);
              const dayLeaves = getDayLeaves(date);
              
              return (
                <Grid item xs key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      minHeight: 80,
                      bgcolor: isCurrentDay ? 'primary.light' : 
                               !isCurrentMonth ? 'grey.50' : 'white',
                      borderColor: isCurrentDay ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isCurrentDay ? 600 : 400,
                          color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                          mb: 0.5,
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      
                      {dayLeaves.map((leave, leaveIndex) => (
                        <Chip
                          key={leaveIndex}
                          label={leave.type}
                          size="small"
                          color={getLeaveTypeColor(leave.type) as any}
                          sx={{ 
                            fontSize: '0.6rem', 
                            height: 16, 
                            mb: 0.5,
                            display: 'block',
                          }}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Grid container spacing={3}>
            {/* Upcoming Leaves */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Leaves
              </Typography>
              <List>
                {upcomingLeaves.map((leave, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Chip
                        label={leave.typeCode}
                        size="small"
                        color={leave.color as any}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={leave.employee}
                      secondary={`${leave.dates} - ${leave.type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Leave Statistics */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Leave Statistics
              </Typography>
              <List>
                {leaveStats.map((stat, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {stat.label}
                          </Typography>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600}
                            color={stat.color ? `${stat.color}.main` : 'text.primary'}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}