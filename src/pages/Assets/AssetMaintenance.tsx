import React from 'react';
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
  Alert,
} from '@mui/material';
import {
  Schedule,
  Build,
  CheckCircle,
  Computer,
  Smartphone,
  Monitor,
} from '@mui/icons-material';

export default function AssetMaintenance() {
  const maintenanceStats = [
    {
      title: 'Scheduled',
      value: '24',
      subtitle: 'Upcoming maintenance',
      color: 'warning',
      icon: Schedule,
    },
    {
      title: 'In Progress',
      value: '8',
      subtitle: 'Currently servicing',
      color: 'info',
      icon: Build,
    },
    {
      title: 'Completed',
      value: '156',
      subtitle: 'This month',
      color: 'success',
      icon: CheckCircle,
    },
  ];

  const maintenanceActivities = [
    {
      id: '1',
      asset: 'MacBook Pro M3',
      assetId: 'LAP001',
      type: 'Preventive Maintenance',
      scheduledDate: '2024-12-15',
      vendor: 'Apple Authorized Service',
      status: 'scheduled',
      icon: Computer,
    },
    {
      id: '2',
      asset: 'Dell Monitor',
      assetId: 'MON001',
      type: 'Screen Replacement',
      completedDate: '2024-12-10',
      vendor: 'Dell Support',
      cost: 150,
      status: 'completed',
      icon: Monitor,
    },
    {
      id: '3',
      asset: 'iPhone 15 Pro',
      assetId: 'MOB001',
      type: 'Battery Service',
      startedDate: '2024-12-12',
      vendor: 'Apple Store',
      estimatedCompletion: '2024-12-16',
      status: 'in-progress',
      icon: Smartphone,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'scheduled': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Asset Maintenance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track maintenance schedules and service history
        </Typography>
      </Box>

      {/* Maintenance Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {maintenanceStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    <stat.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Maintenance Activities */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Maintenance Activities
          </Typography>
          
          <List>
            {maintenanceActivities.map((activity, index) => (
              <ListItem key={activity.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <activity.icon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {activity.asset} - {activity.type}
                      </Typography>
                      <Chip
                        label={activity.status}
                        size="small"
                        color={getStatusColor(activity.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Asset ID: {activity.assetId} • Vendor: {activity.vendor}
                      </Typography>
                      {activity.status === 'scheduled' && (
                        <Typography variant="caption" color="text.secondary">
                          Scheduled: {activity.scheduledDate}
                        </Typography>
                      )}
                      {activity.status === 'completed' && (
                        <Typography variant="caption" color="text.secondary">
                          Completed: {activity.completedDate} • Cost: ${activity.cost}
                        </Typography>
                      )}
                      {activity.status === 'in-progress' && (
                        <Typography variant="caption" color="text.secondary">
                          Started: {activity.startedDate} • Est. Completion: {activity.estimatedCompletion}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Maintenance Schedule
            </Typography>
            <Typography variant="body2">
              Regular maintenance is scheduled quarterly for all IT assets to ensure optimal performance 
              and extend asset lifecycle. Preventive maintenance helps reduce unexpected failures and downtime.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}