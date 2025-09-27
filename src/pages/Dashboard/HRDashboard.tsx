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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AccessTime,
  BeachAccess,
  Star,
  Work,
  PersonAdd,
  CheckCircle,
  Schedule,
  Assignment,
  MoreVert,
  Psychology,
  Warning,
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

export const HRDashboard: React.FC = () => {
  const hrMetrics = [
    {
      title: 'Total Employees',
      value: 1247,
      change: 5.2,
      icon: People,
      color: 'primary' as const,
    },
    {
      title: 'Attendance Rate',
      value: '94.8%',
      change: 2.1,
      icon: AccessTime,
      color: 'success' as const,
    },
    {
      title: 'Open Positions',
      value: 12,
      change: -8.3,
      icon: Work,
      color: 'warning' as const,
    },
    {
      title: 'Avg Performance',
      value: '4.2/5',
      change: 3.7,
      icon: Star,
      color: 'secondary' as const,
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      type: 'Leave Approval',
      employee: 'John Smith',
      details: 'Annual Leave - 5 days',
      priority: 'medium',
      date: '2024-01-15',
    },
    {
      id: 2,
      type: 'Performance Review',
      employee: 'Sarah Johnson',
      details: 'Q4 2023 Review Due',
      priority: 'high',
      date: '2024-01-14',
    },
    {
      id: 3,
      type: 'Onboarding',
      employee: 'Mike Davis',
      details: 'New hire checklist',
      priority: 'high',
      date: '2024-01-13',
    },
    {
      id: 4,
      type: 'Document Review',
      employee: 'Lisa Chen',
      details: 'Contract renewal',
      priority: 'low',
      date: '2024-01-12',
    },
  ];

  const recruitmentPipeline = [
    {
      position: 'Senior Software Engineer',
      applications: 45,
      screening: 12,
      interviews: 5,
      offers: 2,
    },
    {
      position: 'Product Manager',
      applications: 32,
      screening: 8,
      interviews: 3,
      offers: 1,
    },
    {
      position: 'UX Designer',
      applications: 28,
      screening: 6,
      interviews: 2,
      offers: 0,
    },
    {
      position: 'Data Analyst',
      applications: 21,
      screening: 5,
      interviews: 1,
      offers: 0,
    },
  ];

  const hrInsights = [
    {
      id: 1,
      type: 'Retention Alert',
      message: 'Engineering team showing 15% higher turnover risk',
      severity: 'warning',
      action: 'Review Required',
    },
    {
      id: 2,
      type: 'Performance Trend',
      message: 'Sales team performance improved by 12% this quarter',
      severity: 'info',
      action: 'Positive Trend',
    },
    {
      id: 3,
      type: 'Recruitment Insight',
      message: 'Time-to-hire reduced by 8 days with AI screening',
      severity: 'info',
      action: 'Efficiency Gain',
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'error':
        return <Warning sx={{ color: 'error.main' }} />;
      default:
        return <CheckCircle sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        HR Dashboard
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {hrMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pending HR Tasks */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Pending Tasks
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <List>
                {pendingTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority) as any}
                          />
                          <IconButton edge="end">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {task.type === 'Leave Approval' ? <BeachAccess /> : 
                           task.type === 'Performance Review' ? <Star /> : 
                           task.type === 'Onboarding' ? <PersonAdd /> : <Assignment />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {task.type}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {task.employee} - {task.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {task.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* HR AI Insights */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  HR AI Insights
                </Typography>
              </Box>
              <List>
                {hrInsights.map((insight, index) => (
                  <React.Fragment key={insight.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getSeverityIcon(insight.severity)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {insight.type}
                            </Typography>
                            <Chip label={insight.action} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={insight.message}
                      />
                    </ListItem>
                    {index < hrInsights.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button variant="text" size="small" sx={{ mt: 1 }}>
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recruitment Pipeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recruitment Pipeline
                </Typography>
                <Button variant="outlined" size="small">
                  Manage Positions
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Position</TableCell>
                      <TableCell align="center">Applications</TableCell>
                      <TableCell align="center">Screening</TableCell>
                      <TableCell align="center">Interviews</TableCell>
                      <TableCell align="center">Offers</TableCell>
                      <TableCell align="center">Conversion Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recruitmentPipeline.map((position) => {
                      const conversionRate = position.applications > 0 
                        ? Math.round((position.offers / position.applications) * 100) 
                        : 0;
                      
                      return (
                        <TableRow key={position.position}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {position.position}
                          </TableCell>
                          <TableCell align="center">{position.applications}</TableCell>
                          <TableCell align="center">{position.screening}</TableCell>
                          <TableCell align="center">{position.interviews}</TableCell>
                          <TableCell align="center">{position.offers}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {conversionRate}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={conversionRate}
                                sx={{ width: 60, height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};