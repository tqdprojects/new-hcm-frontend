import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccessTime,
  BeachAccess,
  Star,
  AttachMoney,
  Assignment,
  CheckCircle,
  Schedule,
  Receipt,
  PlayArrow,
  Stop,
  EventNote,
  Person,
  Notifications,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  action?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color, action }) => (
  <Card
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        borderColor: `${color}.main`,
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Box component="div" sx={{ fontSize: '2.125rem', fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Box>
          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change > 0 ? (
                <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
              ) : (
                <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} fontSize="small" />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: change > 0 ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {Math.abs(change)}% from last month
              </Typography>
            </Box>
          )}
          {action && (
            <Box sx={{ mt: 2 }}>
              {action}
            </Box>
          )}
        </Box>
        <Avatar sx={{ 
          bgcolor: `${color}.main`, 
          width: 56, 
          height: 56,
          boxShadow: `0 4px 16px ${color === 'primary' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(0,0,0,0.2)'}`,
          transition: 'all 0.3s ease-in-out',
        }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const EmployeeDashboard: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);

  const personalMetrics = [
    {
      title: 'Attendance Rate',
      value: '96.8%',
      change: 2.3,
      icon: AccessTime,
      color: 'success' as const,
      action: (
        <Button
          variant={isCheckedIn ? 'outlined' : 'contained'}
          size="small"
          startIcon={isCheckedIn ? <Stop /> : <PlayArrow />}
          onClick={() => setIsCheckedIn(!isCheckedIn)}
          color={isCheckedIn ? 'error' : 'success'}
        >
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </Button>
      ),
    },
    {
      title: 'Leave Balance',
      value: '18 days',
      icon: BeachAccess,
      color: 'primary' as const,
      action: (
        <Button variant="outlined" size="small">
          Apply Leave
        </Button>
      ),
    },
    {
      title: 'Performance',
      value: '4.2/5',
      change: 5.0,
      icon: Star,
      color: 'warning' as const,
    },
    {
      title: 'This Month Salary',
      value: '$5,200',
      icon: AttachMoney,
      color: 'secondary' as const,
      action: (
        <Button variant="outlined" size="small">
          View Payslip
        </Button>
      ),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Checked in',
      details: 'Started work at 9:15 AM',
      timestamp: '2 hours ago',
      icon: AccessTime,
      color: 'success',
    },
    {
      id: 2,
      action: 'Goal completed',
      details: 'Finished Q1 project milestone',
      timestamp: '1 day ago',
      icon: CheckCircle,
      color: 'success',
    },
    {
      id: 3,
      action: 'Leave approved',
      details: 'Annual leave for Jan 20-22',
      timestamp: '2 days ago',
      icon: BeachAccess,
      color: 'info',
    },
    {
      id: 4,
      action: 'Expense submitted',
      details: 'Travel expenses - $180',
      timestamp: '3 days ago',
      icon: Receipt,
      color: 'warning',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-01-16',
      time: '10:00 AM',
      type: 'Meeting',
    },
    {
      id: 2,
      title: 'Performance Review',
      date: '2024-01-18',
      time: '2:00 PM',
      type: 'Review',
    },
    {
      id: 3,
      title: 'Training Session',
      date: '2024-01-20',
      time: '11:00 AM',
      type: 'Training',
    },
  ];

  const currentGoals = [
    {
      id: 1,
      title: 'Complete React Training',
      progress: 75,
      dueDate: '2024-01-25',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Improve Code Review Skills',
      progress: 45,
      dueDate: '2024-02-15',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Lead Team Project',
      progress: 20,
      dueDate: '2024-03-01',
      priority: 'high',
    },
  ];

  const notifications = [
    {
      id: 1,
      message: 'Your leave request has been approved',
      type: 'success',
      timestamp: '1 hour ago',
    },
    {
      id: 2,
      message: 'Reminder: Team meeting at 10 AM tomorrow',
      type: 'info',
      timestamp: '3 hours ago',
    },
    {
      id: 3,
      message: 'New company policy update available',
      type: 'warning',
      timestamp: '1 day ago',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'info.main';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
          <Person />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Welcome back, John!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your work today
          </Typography>
        </Box>
      </Box>

      {/* Personal Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {personalMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${activity.color}.main` }}>
                          <activity.icon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {activity.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                <Button variant="text" size="small">
                  Mark All Read
                </Button>
              </Box>
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                          <Notifications />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.timestamp}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Goals */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Goals
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <Box>
                {currentGoals.map((goal, index) => (
                  <Box key={goal.id} sx={{ mb: index < currentGoals.length - 1 ? 3 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {goal.title}
                      </Typography>
                      <Chip
                        label={goal.priority}
                        size="small"
                        color={getPriorityColor(goal.priority) as any}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        sx={{ flex: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {goal.progress}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {goal.dueDate}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upcoming Events
              </Typography>
              <List>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <EventNote />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {event.title}
                            </Typography>
                            <Chip label={event.type} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={`${event.date} at ${event.time}`}
                      />
                    </ListItem>
                    {index < upcomingEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};