import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  Assignment,
  TrendingUp,
  Schedule,
  Star,
  CheckCircle,
  Warning,
  Person,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const performanceMetrics = [
    {
      title: 'Active Goals',
      value: '8',
      subtitle: '3 Due This Month',
      icon: Assignment,
      color: 'primary',
    },
    {
      title: 'Goal Completion',
      value: '75%',
      change: '+12%',
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'Review Score',
      value: '4.2/5',
      subtitle: 'Last Cycle',
      icon: Star,
      color: 'warning',
    },
    {
      title: 'Development Actions',
      value: '5',
      subtitle: '2 Completed',
      icon: Person,
      color: 'info',
    },
  ];

  const activeGoals = [
    {
      id: '1',
      title: 'Increase Customer Satisfaction',
      description: 'Achieve 95% customer satisfaction rating',
      progress: 85,
      dueDate: '2024-12-31',
      status: 'on-track',
      weight: 30,
    },
    {
      id: '2',
      title: 'Complete React Training',
      description: 'Finish advanced React certification',
      progress: 60,
      dueDate: '2024-12-15',
      status: 'at-risk',
      weight: 20,
    },
    {
      id: '3',
      title: 'Lead Team Project',
      description: 'Successfully deliver Q4 product release',
      progress: 90,
      dueDate: '2024-12-20',
      status: 'ahead',
      weight: 40,
    },
  ];

  const upcomingReviews = [
    {
      type: 'Mid-Year Review',
      employee: 'John Doe',
      dueDate: '2024-12-30',
      status: 'pending',
    },
    {
      type: 'Annual Review',
      employee: 'Sarah Wilson',
      dueDate: '2025-01-15',
      status: 'scheduled',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'ahead': return 'info';
      case 'at-risk': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Performance Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track goals, reviews, and development progress
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => navigate('/performance/goals')}
          >
            Manage Goals
          </Button>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={() => navigate('/performance/reviews')}
          >
            Start Review
          </Button>
        </Box>
      </Box>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: `${metric.color}.main` }}>
                    <metric.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    {metric.subtitle && (
                      <Typography variant="caption" color="text.secondary">
                        {metric.subtitle}
                      </Typography>
                    )}
                    {metric.change && (
                      <Typography variant="caption" color="success.main">
                        {metric.change}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Goals */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Active Goals
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/performance/goals')}
                >
                  View All
                </Button>
              </Box>
              
              {activeGoals.map((goal) => (
                <Card key={goal.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {goal.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {goal.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={goal.status.replace('-', ' ')}
                            size="small"
                            color={getStatusColor(goal.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Weight: {goal.weight}% • Due: {goal.dueDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {goal.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: goal.progress >= 80 ? 'success.main' : 
                                     goal.progress >= 60 ? 'warning.main' : 'error.main',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Reviews */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Reviews
              </Typography>
              
              <List>
                {upcomingReviews.map((review, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <Assessment sx={{ fontSize: 18 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={review.type}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {review.employee}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {review.dueDate}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={review.status}
                      size="small"
                      color={review.status === 'pending' ? 'warning' : 'info'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}