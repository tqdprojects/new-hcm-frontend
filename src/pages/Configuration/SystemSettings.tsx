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
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Alert,
} from '@mui/material';
import {
  Settings,
  Business,
  Security,
  Notifications,
  Psychology,
  Save,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Schedule,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SystemSettings() {
  const { isAdmin, isSuperAdmin } = usePermissions();
  const [tabValue, setTabValue] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: any) => {
    console.log('Settings update:', data);
  };

  const systemHealth = [
    { service: 'Database', status: 'healthy', uptime: '99.9%', lastCheck: '2 minutes ago' },
    { service: 'Redis Cache', status: 'healthy', uptime: '99.8%', lastCheck: '1 minute ago' },
    { service: 'AI Services', status: 'healthy', uptime: '98.5%', lastCheck: '30 seconds ago' },
    { service: 'Email Service', status: 'warning', uptime: '95.2%', lastCheck: '5 minutes ago' },
    { service: 'File Storage', status: 'healthy', uptime: '99.7%', lastCheck: '1 minute ago' },
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

  return (
    <PermissionGuard module="configuration" action="read" showError>
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          System Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage system settings and configurations
        </Typography>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="General Settings" />
              <Tab label="Security" />
              <Tab label="AI Configuration" />
              <Tab label="System Health" />
            </Tabs>
          </Box>

          {/* General Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <PermissionGuard module="configuration" action="update">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Company Name"
                          defaultValue="Demo Corporation"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="timeZone"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Time Zone</InputLabel>
                          <Select {...field} label="Time Zone" defaultValue="America/Los_Angeles">
                            <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                            <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                            <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                            <MenuItem value="UTC">UTC</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Default Currency</InputLabel>
                          <Select {...field} label="Default Currency" defaultValue="USD">
                            <MenuItem value="USD">US Dollar (USD)</MenuItem>
                            <MenuItem value="EUR">Euro (EUR)</MenuItem>
                            <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                            <MenuItem value="INR">Indian Rupee (INR)</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dateFormat"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Date Format</InputLabel>
                          <Select {...field} label="Date Format" defaultValue="MM/DD/YYYY">
                            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                    >
                      Save Settings
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </PermissionGuard>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Authentication Settings
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Require Multi-Factor Authentication"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Password Complexity Requirements"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Single Sign-On (SSO)"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Session Management
                    </Typography>
                    <TextField
                      fullWidth
                      label="Session Timeout (minutes)"
                      type="number"
                      defaultValue={15}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Max Concurrent Sessions"
                      type="number"
                      defaultValue={3}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* AI Configuration Tab */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              AI features use open-source models hosted locally for complete data privacy and security.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      AI Features
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Resume-JD Matching"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Payroll Anomaly Detection"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Expense OCR Processing"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Performance Analytics"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Retention Risk Modeling"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Model Configuration
                    </Typography>
                    <TextField
                      fullWidth
                      label="Confidence Threshold"
                      type="number"
                      defaultValue={0.75}
                      inputProps={{ min: 0.1, max: 1.0, step: 0.05 }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Batch Processing Size"
                      type="number"
                      defaultValue={100}
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable Audit Logging"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* System Health Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                System Health Monitor
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
              >
                Refresh Status
              </Button>
            </Box>
            
            <List>
              {systemHealth.map((service, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getStatusIcon(service.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={service.service}
                    secondary={`Uptime: ${service.uptime} • Last check: ${service.lastCheck}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={service.status}
                      color={getStatusColor(service.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </Card>
      </Box>
    </PermissionGuard>
  );
}