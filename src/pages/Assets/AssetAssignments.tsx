import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Computer,
  Smartphone,
  Monitor,
  CheckCircle,
  Warning,
  ReportProblem,
} from '@mui/icons-material';

export default function AssetAssignments() {
  const assignedAssets = [
    {
      id: 'LAP001',
      name: 'MacBook Pro M3',
      category: 'Laptop',
      assignedDate: '2024-01-15',
      serialNumber: 'ABC123456789',
      status: 'active',
      icon: Computer,
    },
    {
      id: 'MOB001',
      name: 'iPhone 15 Pro',
      category: 'Mobile',
      assignedDate: '2024-01-15',
      serialNumber: 'DEF987654321',
      status: 'active',
      icon: Smartphone,
    },
    {
      id: 'MON001',
      name: 'Dell Monitor 27"',
      category: 'Monitor',
      assignedDate: '2024-01-15',
      serialNumber: 'GHI456789123',
      status: 'active',
      icon: Monitor,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Assets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your assigned assets
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Currently Assigned Assets
          </Typography>
          
          <Grid container spacing={3}>
            {assignedAssets.map((asset) => (
              <Grid item xs={12} md={6} key={asset.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <asset.icon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {asset.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Asset ID: {asset.id} • Assigned: {asset.assignedDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Serial: {asset.serialNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip
                          icon={<CheckCircle />}
                          label={asset.status}
                          color="success"
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ReportProblem />}
                        >
                          Report Issue
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Asset Care Guidelines
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>Keep assets in good condition and report any issues immediately</li>
              <li>Do not share company assets with unauthorized personnel</li>
              <li>Return assets promptly when requested or upon separation</li>
              <li>Follow company security policies for data protection</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}