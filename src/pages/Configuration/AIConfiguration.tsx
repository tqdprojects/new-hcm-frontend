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
  Slider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Analytics,
  Visibility,
  Save,
  Refresh,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Speed,
  Memory,
  Storage,
  CloudQueue,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import PermissionGuard from '../../components/Auth/PermissionGuard';

interface AIConfigurationForm {
  enableResumeMatching: boolean;
  enablePayrollAnomalies: boolean;
  enableExpenseOCR: boolean;
  enablePerformanceInsights: boolean;
  enableChatbot: boolean;
  confidenceThreshold: number;
  auditAIDecisions: boolean;
  dataRetention: number;
  modelSettings: {
    resumeModel: string;
    payrollModel: string;
    ocrModel: string;
    performanceModel: string;
  };
  apiLimits: {
    dailyRequests: number;
    monthlyRequests: number;
    concurrentRequests: number;
  };
  privacySettings: {
    anonymizeData: boolean;
    encryptData: boolean;
    shareWithThirdParty: boolean;
  };
}

export default function AIConfiguration() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('features');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AIConfigurationForm>({
    defaultValues: {
      enableResumeMatching: true,
      enablePayrollAnomalies: true,
      enableExpenseOCR: true,
      enablePerformanceInsights: false,
      enableChatbot: false,
      confidenceThreshold: 0.75,
      auditAIDecisions: true,
      dataRetention: 365,
      modelSettings: {
        resumeModel: 'gpt-4-turbo',
        payrollModel: 'claude-3-sonnet',
        ocrModel: 'vision-pro',
        performanceModel: 'analytics-v2',
      },
      apiLimits: {
        dailyRequests: 1000,
        monthlyRequests: 25000,
        concurrentRequests: 10,
      },
      privacySettings: {
        anonymizeData: true,
        encryptData: true,
        shareWithThirdParty: false,
      },
    },
  });

  const watchedValues = watch();

  // Mock AI usage data
  const aiUsageData = [
    {
      feature: 'Resume Matching',
      requests: 1247,
      accuracy: 94.2,
      cost: 156.80,
      status: 'active',
    },
    {
      feature: 'Payroll Anomalies',
      requests: 892,
      accuracy: 97.8,
      cost: 89.20,
      status: 'active',
    },
    {
      feature: 'Expense OCR',
      requests: 2156,
      accuracy: 91.5,
      cost: 215.60,
      status: 'active',
    },
    {
      feature: 'Performance Insights',
      requests: 0,
      accuracy: 0,
      cost: 0,
      status: 'disabled',
    },
  ];

  const onSubmit = (data: AIConfigurationForm) => {
    console.log('Updating AI configuration:', data);
    setIsEditing(false);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Resume Matching': return <Psychology />;
      case 'Payroll Anomalies': return <Analytics />;
      case 'Expense OCR': return <Visibility />;
      case 'Performance Insights': return <TrendingUp />;
      default: return <AutoAwesome />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'disabled': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const calculateMonthlyCost = () => {
    let totalCost = 0;
    if (watchedValues.enableResumeMatching) totalCost += 200;
    if (watchedValues.enablePayrollAnomalies) totalCost += 150;
    if (watchedValues.enableExpenseOCR) totalCost += 300;
    if (watchedValues.enablePerformanceInsights) totalCost += 250;
    if (watchedValues.enableChatbot) totalCost += 400;
    return totalCost;
  };

  return (
    <PermissionGuard module="ai-configuration" action="read" showError>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              AI Configuration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure AI features and manage model settings
            </Typography>
          </Box>
          
          <PermissionGuard module="ai-configuration" action="update">
            <Button
              variant={isEditing ? 'contained' : 'outlined'}
              startIcon={isEditing ? <Save /> : <Psychology />}
              onClick={() => {
                if (isEditing) {
                  handleSubmit(onSubmit)();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Save Configuration' : 'Edit Configuration'}
            </Button>
          </PermissionGuard>
        </Box>

        {/* AI Overview */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Psychology sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" fontWeight={600}>
                      4/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Features Active
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="success.main">
                        4,295
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Requests
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="info.main">
                        94.2%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Accuracy
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="warning.main">
                        $461.60
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="primary.main">
                        99.8%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Uptime
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
            variant={activeTab === 'features' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('features')}
            sx={{ mr: 1 }}
          >
            AI Features
          </Button>
          <Button
            variant={activeTab === 'models' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('models')}
            sx={{ mr: 1 }}
          >
            Model Settings
          </Button>
          <Button
            variant={activeTab === 'usage' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('usage')}
            sx={{ mr: 1 }}
          >
            Usage Analytics
          </Button>
          <Button
            variant={activeTab === 'privacy' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Security
          </Button>
        </Box>

        {activeTab === 'features' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* AI Features */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      AI Features Configuration
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="enableResumeMatching"
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
                                <Box>
                                  <Typography variant="subtitle2">
                                    Resume Matching
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    AI-powered candidate matching and ranking
                                  </Typography>
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="enablePayrollAnomalies"
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
                                <Box>
                                  <Typography variant="subtitle2">
                                    Payroll Anomaly Detection
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Detect unusual patterns in payroll data
                                  </Typography>
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="enableExpenseOCR"
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
                                <Box>
                                  <Typography variant="subtitle2">
                                    Expense OCR
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Extract data from receipts and invoices
                                  </Typography>
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="enablePerformanceInsights"
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
                                <Box>
                                  <Typography variant="subtitle2">
                                    Performance Insights
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    AI-driven performance analytics
                                  </Typography>
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="enableChatbot"
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
                                <Box>
                                  <Typography variant="subtitle2">
                                    HR Chatbot
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    AI assistant for employee queries
                                  </Typography>
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

              {/* AI Settings */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      AI Settings
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Confidence Threshold: {(watchedValues.confidenceThreshold * 100).toFixed(0)}%
                        </Typography>
                        <Controller
                          name="confidenceThreshold"
                          control={control}
                          render={({ field }) => (
                            <Slider
                              {...field}
                              min={0.5}
                              max={0.95}
                              step={0.05}
                              disabled={!isEditing}
                              marks={[
                                { value: 0.5, label: '50%' },
                                { value: 0.75, label: '75%' },
                                { value: 0.95, label: '95%' },
                              ]}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="dataRetention"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Data Retention (days)"
                              type="number"
                              disabled={!isEditing}
                              inputProps={{ min: 30, max: 2555 }}
                              helperText="How long to keep AI processing data"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Controller
                          name="auditAIDecisions"
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
                              label="Audit AI Decisions"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cost Estimation */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cost Estimation
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Estimated monthly cost: <strong>${calculateMonthlyCost()}</strong>
                    </Alert>
                    
                    <Typography variant="body2" color="text.secondary">
                      Costs are calculated based on enabled features and expected usage patterns.
                      Actual costs may vary based on usage volume.
                    </Typography>
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
                  Save Configuration
                </Button>
              </Box>
            )}
          </form>
        )}

        {activeTab === 'usage' && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Usage Analytics
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feature</TableCell>
                      <TableCell align="right">Requests</TableCell>
                      <TableCell align="right">Accuracy</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aiUsageData.map((row) => (
                      <TableRow key={row.feature}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getFeatureIcon(row.feature)}
                            {row.feature}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.requests.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          {row.accuracy > 0 ? `${row.accuracy}%` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          ${row.cost.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </PermissionGuard>
  );
}