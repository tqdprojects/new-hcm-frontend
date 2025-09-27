import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Warning,
  Assessment,
  Receipt,
  People,
  AttachMoney,
  Work,
} from '@mui/icons-material';
import { useAIHealth, usePayrollAnomalies, usePayrollForecast } from '../../hooks/useAI';
import AIInsightCard from '../../components/AI/AIInsightCard';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';
import AnomalyBadge from '../../components/AI/AnomalyBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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

export default function AIInsights() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState({ month: 12, year: 2024 });

  const { data: aiHealthResponse } = useAIHealth();
  const payrollAnomalies = usePayrollAnomalies();
  const { data: forecastResponse } = usePayrollForecast(3);

  const aiHealth = aiHealthResponse?.data;
  const forecasts = forecastResponse?.data || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRunAnomalyDetection = () => {
    payrollAnomalies.mutate(selectedPeriod);
  };

  const mockInsights = [
    {
      title: 'High Performer Identified',
      insight: 'John Doe shows exceptional performance with 95% goal completion rate',
      confidence: 0.92,
      type: 'success' as const,
      features: ['Goal completion', 'Peer feedback', 'Project delivery'],
      explanation: 'Analysis of performance data shows consistent high achievement',
      recommendations: ['Consider for promotion', 'Assign mentoring role']
    },
    {
      title: 'Retention Risk Alert',
      insight: 'Sarah Wilson shows increased flight risk based on behavioral patterns',
      confidence: 0.78,
      type: 'warning' as const,
      features: ['Attendance decline', 'Low engagement', 'Salary benchmark'],
      explanation: 'Multiple risk factors indicate potential turnover',
      recommendations: ['Schedule career discussion', 'Review compensation']
    },
    {
      title: 'Skill Gap Detected',
      insight: 'Engineering team lacks cloud architecture expertise',
      confidence: 0.85,
      type: 'info' as const,
      features: ['Job requirements', 'Employee skills', 'Project needs'],
      explanation: 'Analysis of job postings vs employee skills shows gap',
      recommendations: ['Organize cloud training', 'Hire cloud architect']
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            AI Insights Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered analytics and recommendations for your organization
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {aiHealth && (
            <Chip
              icon={<Psychology />}
              label={`${aiHealth.models?.length || 0} AI Models Active`}
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* AI System Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            AI System Status
          </Typography>
          <Grid container spacing={2}>
            {aiHealth?.models?.map((model: any, index: number) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {model.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {model.type} • v{model.version}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={model.status}
                      size="small"
                      color={model.status === 'healthy' ? 'success' : 'error'}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Key Insights" />
            <Tab label="Payroll Analytics" />
            <Tab label="Performance Intelligence" />
            <Tab label="Recruitment AI" />
            <Tab label="Expense Intelligence" />
          </Tabs>
        </Box>

        {/* Key Insights Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {mockInsights.map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <AIInsightCard {...insight} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payroll Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Payroll Cost Forecast
                    </Typography>
                    <ConfidenceBadge confidence={0.75} />
                  </Box>
                  
                  {forecasts.length > 0 && (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecasts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Predicted Cost']} />
                          <Line
                            type="monotone"
                            dataKey="predictedCost"
                            stroke="#1976d2"
                            strokeWidth={3}
                            dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Anomaly Detection
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Pay Period</InputLabel>
                      <Select
                        value={`${selectedPeriod.month}-${selectedPeriod.year}`}
                        onChange={(e) => {
                          const [month, year] = e.target.value.split('-');
                          setSelectedPeriod({ month: parseInt(month), year: parseInt(year) });
                        }}
                        label="Pay Period"
                      >
                        <MenuItem value="12-2024">December 2024</MenuItem>
                        <MenuItem value="11-2024">November 2024</MenuItem>
                        <MenuItem value="10-2024">October 2024</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Assessment />}
                    onClick={handleRunAnomalyDetection}
                    disabled={payrollAnomalies.isPending}
                  >
                    {payrollAnomalies.isPending ? 'Analyzing...' : 'Run Analysis'}
                  </Button>

                  {payrollAnomalies.data && (
                    <Box sx={{ mt: 2 }}>
                      <Alert 
                        severity={payrollAnomalies.data.data.summary.criticalIssues > 0 ? 'error' : 'success'}
                        sx={{ mb: 2 }}
                      >
                        Found {payrollAnomalies.data.data.anomalies.length} anomalies in {payrollAnomalies.data.data.summary.totalRecords} records
                      </Alert>
                      
                      <List dense>
                        {payrollAnomalies.data.data.anomalies.slice(0, 3).map((anomaly: any, index: number) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AnomalyBadge severity={anomaly.severity} />
                            </ListItemIcon>
                            <ListItemText
                              primary={anomaly.description}
                              secondary={anomaly.recommendation}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Intelligence Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AIInsightCard
                title="Team Performance Trend"
                insight="Overall team performance improved by 12% this quarter"
                confidence={0.88}
                type="success"
                features={['Goal completion rates', 'Peer feedback', 'Project delivery']}
                icon={TrendingUp}
                explanation="Analysis of performance metrics shows positive trend"
                recommendations={['Continue current practices', 'Share best practices across teams']}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AIInsightCard
                title="Skill Development Needs"
                insight="Cloud architecture skills gap identified across engineering"
                confidence={0.82}
                type="warning"
                features={['Job requirements', 'Employee skills', 'Market trends']}
                icon={Assessment}
                explanation="Gap analysis shows need for cloud expertise"
                recommendations={['Organize cloud training program', 'Consider hiring cloud architect']}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Recruitment AI Tab */}
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Recruitment AI Features:</strong> Resume-JD matching, candidate shortlisting, and interview question generation are available in the Recruitment module.
            </Typography>
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Work sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Resume Matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered resume-job relevance scoring
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Smart Shortlisting
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automated candidate ranking and shortlisting
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Interview Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-generated interview questions and rubrics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Expense Intelligence Tab */}
        <TabPanel value={tabValue} index={4}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Expense AI Features:</strong> OCR receipt processing, PII detection, and automatic expense classification are available in the Claims module.
            </Typography>
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Receipt sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    OCR Processing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatic receipt data extraction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    PII Protection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatic PII detection and redaction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Smart Classification
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatic expense categorization
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
}