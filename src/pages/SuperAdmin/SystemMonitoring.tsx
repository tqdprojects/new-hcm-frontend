import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Memory,
  Storage,
  Speed,
  CloudQueue,
  Security,
  Warning,
  Error,
  CheckCircle,
  Refresh,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';

export default function SystemMonitoring() {
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // Real-time system metrics
  const { data: systemMetrics, isConnected } = useRealTimeData({
    queryKeys: [['system-health']],
    events: ['system:health-update', 'system:alert'],
    endpoint: '/super-admin/system-health',
    refetchInterval: 10000, // 10 seconds
  });

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, disk: 78, network: 23 },
    { time: '04:00', cpu: 38, memory: 58, disk: 78, network: 18 },
    { time: '08:00', cpu: 72, memory: 71, disk: 79, network: 45 },
    { time: '12:00', cpu: 85, memory: 78, disk: 80, network: 67 },
    { time: '16:00', cpu: 92, memory: 82, disk: 81, network: 78 },
    { time: '20:00', cpu: 68, memory: 75, disk: 81, network: 52 },
  ];

  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: 99.9, instances: 3 },
    { name: 'Database Cluster', status: 'healthy', uptime: 99.8, instances: 5 },
    { name: 'Redis Cache', status: 'healthy', uptime: 99.7, instances: 2 },
    { name: 'AI Services', status: 'warning', uptime: 98.5, instances: 4 },
    { name: 'File Storage', status: 'healthy', uptime: 99.6, instances: 6 },
    { name: 'Email Service', status: 'error', uptime: 95.2, instances: 2 },
  ];

  const alerts = [
    {
      id: '1',
      type: 'Critical',
      service: 'Email Service',
      message: 'High error rate detected - 15% of emails failing',
      timestamp: '2024-12-03T10:30:00Z',
      severity: 'critical',
      status: 'active',
    },
    {
      id: '2',
      type: 'Warning',
      service: 'AI Services',
      message: 'Response time increased by 25% - investigating',
      timestamp: '2024-12-03T09:45:00Z',
      severity: 'warning',
      status: 'investigating',
    },
    {
      id: '3',
      type: 'Info',
      service: 'Database',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2024-12-03T08:00:00Z',
      severity: 'info',
      status: 'resolved',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <CheckCircle />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            System Monitoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time system health and performance monitoring
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={isConnected ? 'Live Monitoring' : 'Offline'}
            color={isConnected ? 'success' : 'error'}
            icon={isConnected ? <CheckCircle /> : <Error />}
          />
          <Button
            variant="outlined"
            startIcon={<Settings />}
          >
            Configure Alerts
          </Button>
        </Box>
      </Box>

      {/* System Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Speed />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    68%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CPU Usage
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={68}
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Memory />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    74%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={74}
                color="info"
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Storage />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    82%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disk Usage
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={82}
                color="warning"
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CloudQueue />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    145ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response Time
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                24-Hour Performance Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#1976d2" name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#00796b" name="Memory %" />
                    <Line type="monotone" dataKey="disk" stroke="#f57c00" name="Disk %" />
                    <Line type="monotone" dataKey="network" stroke="#9c27b0" name="Network %" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services Status & Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Service Status
              </Typography>
              <List>
                {services.map((service, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getStatusColor(service.status) + '.main' }}>
                        {getStatusIcon(service.status)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {service.name}
                          </Typography>
                          <Chip
                            label={service.status}
                            size="small"
                            color={getStatusColor(service.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={`Uptime: ${service.uptime}% • ${service.instances} instances`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Alerts
              </Typography>
              <List>
                {alerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setAlertDialog(true);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getSeverityColor(alert.severity) + '.main' }}>
                        <Notifications />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {alert.service}
                          </Typography>
                          <Chip
                            label={alert.type}
                            size="small"
                            color={getSeverityColor(alert.severity) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alert Detail Dialog */}
      <Dialog
        open={alertDialog}
        onClose={() => setAlertDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Alert Details - {selectedAlert?.service}
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Alert severity={getSeverityColor(selectedAlert.severity) as any} sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight={600}>
                  {selectedAlert.type}: {selectedAlert.message}
                </Typography>
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Service
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedAlert.service}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Severity
                  </Typography>
                  <Chip
                    label={selectedAlert.severity}
                    size="small"
                    color={getSeverityColor(selectedAlert.severity) as any}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {selectedAlert.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>
            Close
          </Button>
          <Button variant="contained">
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}