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
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  AvatarGroup,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AccessTime,
  BeachAccess,
  Star,
  Assignment,
  CheckCircle,
  Schedule,
  Receipt,
  MoreVert,
  SelfImprovement,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Box component="div" sx={{ fontSize: '2.125rem', fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Box>
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
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const ManagerDashboard: React.FC = () => {
  const teamMetrics = [
    {
      title: 'Team Size',
      value: 12,
      change: 9.1,
      icon: People,
      color: 'primary' as const,
    },
    {
      title: 'Team Attendance',
      value: '96.2%',
      change: 1.8,
      icon: AccessTime,
      color: 'success' as const,
    },
    {
      title: 'Active Leaves',
      value: 2,
      change: -33.3,
      icon: BeachAccess,
      color: 'warning' as const,
    },
    {
      title: 'Avg Performance',
      value: '4.3/5',
      change: 7.5,
      icon: Star,
      color: 'secondary' as const,
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Leave Request',
      employee: 'John Smith',
      details: 'Annual Leave - 3 days',
      priority: 'medium',
      date: '2024-01-15',
      avatar: 'JS',
    },
    {
      id: 2,
      type: 'Expense Claim',
      employee: 'Sarah Johnson',
      details: 'Client meeting expenses - $120',
      priority: 'low',
      date: '2024-01-14',
      avatar: 'SJ',
    },
    {
      id: 3,
      type: 'Timesheet',
      employee: 'Mike Davis',
      details: 'Week ending Jan 12 - 42 hours',
      priority: 'medium',
      date: '2024-01-13',
      avatar: 'MD',
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Senior Developer',
      avatar: 'JS',
      status: 'present',
      performance: 4.5,
      tasksCompleted: 8,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      avatar: 'SJ',
      status: 'present',
      performance: 4.2,
      tasksCompleted: 6,
    },
    {
      id: 3,
      name: 'Mike Davis',
      role: 'Backend Developer',
      avatar: 'MD',
      status: 'on-leave',
      performance: 4.0,
      tasksCompleted: 5,
    },
    {
      id: 4,
      name: 'Lisa Chen',
      role: 'QA Engineer',
      avatar: 'LC',
      status: 'present',
      performance: 4.4,
      tasksCompleted: 7,
    },
  ];

  const upcomingOneOnOnes = [
    {
      id: 1,
      employee: 'John Smith',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'Regular Check-in',
      avatar: 'JS',
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      date: '2024-01-17',
      time: '10:00 AM',
      type: 'Performance Review',
      avatar: 'SJ',
    },
    {
      id: 3,
      employee: 'Lisa Chen',
      date: '2024-01-18',
      time: '3:30 PM',
      type: 'Career Development',
      avatar: 'LC',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'on-leave':
        return 'warning';
      case 'absent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Team Dashboard
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {teamMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approvals */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Pending Approvals
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <List>
                {pendingApprovals.map((approval, index) => (
                  <React.Fragment key={approval.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={approval.priority}
                            size="small"
                            color={getPriorityColor(approval.priority) as any}
                          />
                          <IconButton edge="end">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {approval.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {approval.type}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {approval.employee}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {approval.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {approval.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingApprovals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming One-on-Ones */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upcoming One-on-Ones
                </Typography>
                <Button variant="outlined" size="small">
                  Schedule More
                </Button>
              </Box>
              <List>
                {upcomingOneOnOnes.map((meeting, index) => (
                  <React.Fragment key={meeting.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {meeting.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {meeting.employee}
                            </Typography>
                            <Chip label={meeting.type} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {meeting.date} at {meeting.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingOneOnOnes.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Team Overview
              </Typography>
              <Grid container spacing={3}>
                {teamMembers.map((member) => (
                  <Grid item xs={12} sm={6} md={3} key={member.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                          }}
                        >
                          {member.avatar}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {member.role}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Chip
                            label={member.status}
                            size="small"
                            color={getStatusColor(member.status) as any}
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Performance
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Star sx={{ color: 'warning.main', fontSize: '1rem' }} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {member.performance}/5
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tasks Completed
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {member.tasksCompleted}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};