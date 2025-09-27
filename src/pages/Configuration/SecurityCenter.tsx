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
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security,
  Shield,
  Lock,
  Visibility,
  Warning,
  CheckCircle,
  Save,
  Add,
  Delete,
  Block,
  VpnKey,
  Fingerprint,
  Computer,
  LocationOn,
  History,
  Report,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import PermissionGuard from '../../components/Auth/PermissionGuard';

interface SecurityPolicyForm {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
    preventReuse: number;
  };
  sessionPolicy: {
    sessionTimeout: number;
    maxConcurrentSessions: number;
    requireMFA: boolean;
    rememberDevice: boolean;
  };
  accessPolicy: {
    ipWhitelist: string[];
    allowedCountries: string[];
    blockSuspiciousActivity: boolean;
    maxFailedAttempts: number;
    lockoutDuration: number;
  };
  auditPolicy: {
    logAllActions: boolean;
    retentionPeriod: number;
    realTimeAlerts: boolean;
    exportLogs: boolean;
  };
}

export default function SecurityCenter() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('policies');
  const [ipDialog, setIpDialog] = useState(false);
  const [newIp, setNewIp] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SecurityPolicyForm>({
    defaultValues: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiry: 90,
        preventReuse: 5,
      },
      sessionPolicy: {
        sessionTimeout: 30,
        maxConcurrentSessions: 3,
        requireMFA: false,
        rememberDevice: true,
      },
      accessPolicy: {
        ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
        allowedCountries: ['US', 'CA', 'GB', 'IN'],
        blockSuspiciousActivity: true,
        maxFailedAttempts: 5,
        lockoutDuration: 15,
      },
      auditPolicy: {
        logAllActions: true,
        retentionPeriod: 365,
        realTimeAlerts: true,
        exportLogs: true,
      },
    },
  });

  const watchedValues = watch();

  // Mock security events data
  const securityEvents = [
    {
      id: '1',
      type: 'Failed Login',
      user: 'john.doe@company.com',
      ip: '192.168.1.100',
      location: 'New York, US',
      timestamp: '2024-12-03T10:30:00Z',
      severity: 'medium',
      status: 'blocked',
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      user: 'jane.smith@company.com',
      ip: '203.0.113.1',
      location: 'Unknown',
      timestamp: '2024-12-03T09:15:00Z',
      severity: 'high',
      status: 'investigating',
    },
    {
      id: '3',
      type: 'Password Change',
      user: 'admin@company.com',
      ip: '192.168.1.50',
      location: 'San Francisco, US',
      timestamp: '2024-12-03T08:45:00Z',
      severity: 'low',
      status: 'completed',
    },
  ];

  const onSubmit = (data: SecurityPolicyForm) => {
    console.log('Updating security policies:', data);
    setIsEditing(false);
  };

  const addIpToWhitelist = () => {
    if (newIp) {
      const currentIps = watchedValues.accessPolicy.ipWhitelist;
      setValue('accessPolicy.ipWhitelist', [...currentIps, newIp]);
      setNewIp('');
      setIpDialog(false);
    }
  };

  const removeIpFromWhitelist = (index: number) => {
    const currentIps = watchedValues.accessPolicy.ipWhitelist;
    setValue('accessPolicy.ipWhitelist', currentIps.filter((_, i) => i !== index));
  };

  const getSecurityScore = () => {
    let score = 0;
    const policies = watchedValues;
    
    // Password policy scoring
    if (policies.passwordPolicy.minLength >= 8) score += 10;
    if (policies.passwordPolicy.requireUppercase) score += 5;
    if (policies.passwordPolicy.requireLowercase) score += 5;
    if (policies.passwordPolicy.requireNumbers) score += 5;
    if (policies.passwordPolicy.requireSpecialChars) score += 10;
    if (policies.passwordPolicy.passwordExpiry <= 90) score += 10;
    
    // Session policy scoring
    if (policies.sessionPolicy.sessionTimeout <= 30) score += 10;
    if (policies.sessionPolicy.requireMFA) score += 20;
    if (policies.sessionPolicy.maxConcurrentSessions <= 3) score += 5;
    
    // Access policy scoring
    if (policies.accessPolicy.blockSuspiciousActivity) score += 10;
    if (policies.accessPolicy.maxFailedAttempts <= 5) score += 5;
    if (policies.accessPolicy.ipWhitelist.length > 0) score += 10;
    
    return Math.min(score, 100);
  };

  const securityScore = getSecurityScore();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <PermissionGuard module="security" action="read" showError>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Security Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage security policies and monitor security events
            </Typography>
          </Box>
          
          <PermissionGuard module="security" action="update">
            <Button
              variant={isEditing ? 'contained' : 'outlined'}
              startIcon={isEditing ? <Save /> : <Security />}
              onClick={() => {
                if (isEditing) {
                  handleSubmit(onSubmit)();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Save Changes' : 'Edit Policies'}
            </Button>
          </PermissionGuard>
        </Box>

        {/* Security Score */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Shield 
                    sx={{ 
                      fontSize: 48, 
                      color: securityScore >= 80 ? 'success.main' : 
                             securityScore >= 60 ? 'warning.main' : 'error.main' 
                    }} 
                  />
                  <Box>
                    <Typography variant="h3" fontWeight={600}>
                      {securityScore}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Security Score
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Security Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="success.main">
                        24
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Policies
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="warning.main">
                        3
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Security Alerts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="info.main">
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Sessions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="error.main">
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blocked IPs
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant={activeTab === 'policies' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('policies')}
            sx={{ mr: 1 }}
          >
            Security Policies
          </Button>
          <Button
            variant={activeTab === 'events' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('events')}
            sx={{ mr: 1 }}
          >
            Security Events
          </Button>
          <Button
            variant={activeTab === 'audit' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('audit')}
          >
            Audit Logs
          </Button>
        </Box>

        {activeTab === 'policies' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Password Policy */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Password Policy
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="passwordPolicy.minLength"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Minimum Length"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 6, max: 20 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="passwordPolicy.passwordExpiry"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Password Expiry (days)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 30, max: 365 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="passwordPolicy.preventReuse"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Prevent Reuse (last N passwords)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 0, max: 10 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Password Requirements
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Controller
                              name="passwordPolicy.requireUppercase"
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      {...field}
                                      checked={field.value}
                                      disabled={!isEditing}
                                    />
                                  }
                                  label="Uppercase Letters"
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Controller
                              name="passwordPolicy.requireLowercase"
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      {...field}
                                      checked={field.value}
                                      disabled={!isEditing}
                                    />
                                  }
                                  label="Lowercase Letters"
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Controller
                              name="passwordPolicy.requireNumbers"
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      {...field}
                                      checked={field.value}
                                      disabled={!isEditing}
                                    />
                                  }
                                  label="Numbers"
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Controller
                              name="passwordPolicy.requireSpecialChars"
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      {...field}
                                      checked={field.value}
                                      disabled={!isEditing}
                                    />
                                  }
                                  label="Special Characters"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Session Policy */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Session Policy
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="sessionPolicy.sessionTimeout"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Session Timeout (minutes)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 5, max: 480 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="sessionPolicy.maxConcurrentSessions"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Max Concurrent Sessions"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 1, max: 10 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="sessionPolicy.requireMFA"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  disabled={!isEditing}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Fingerprint />
                                  <Typography>Require MFA</Typography>
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Access Policy */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Access Policy
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="accessPolicy.maxFailedAttempts"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Max Failed Login Attempts"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 3, max: 10 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="accessPolicy.lockoutDuration"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Lockout Duration (minutes)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 5, max: 60 }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Controller
                          name="accessPolicy.blockSuspiciousActivity"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  disabled={!isEditing}
                                />
                              }
                              label="Block Suspicious Activity"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2">
                            IP Whitelist
                          </Typography>
                          {isEditing && (
                            <Button
                              size="small"
                              startIcon={<Add />}
                              onClick={() => setIpDialog(true)}
                            >
                              Add IP
                            </Button>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {watchedValues.accessPolicy.ipWhitelist.map((ip, index) => (
                            <Chip
                              key={index}
                              label={ip}
                              onDelete={isEditing ? () => removeIpFromWhitelist(index) : undefined}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                >
                  Save Security Policies
                </Button>
              </Box>
            )}
          </form>
        )}

        {activeTab === 'events' && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Security Events
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.user}</TableCell>
                        <TableCell>{event.ip}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.severity}
                            size="small"
                            color={getSeverityColor(event.severity) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Block />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Add IP Dialog */}
        <Dialog open={ipDialog} onClose={() => setIpDialog(false)}>
          <DialogTitle>Add IP to Whitelist</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="IP Address or CIDR"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="192.168.1.0/24"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIpDialog(false)}>Cancel</Button>
            <Button onClick={addIpToWhitelist} variant="contained">
              Add IP
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  );
}