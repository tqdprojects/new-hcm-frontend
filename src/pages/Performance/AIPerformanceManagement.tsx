import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Star,
  Assignment,
  Person,
  Analytics,
  Timeline,
  School,
  Work,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  Visibility,
  Edit,
  Add,
  Send,
  Assessment,
  SelfImprovement,
  EmojiEvents,
  Speed,
  GpsFixed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAIPerformance, usePerformanceInsights } from '../../hooks/usePerformance';
import { useAuthStore } from '../../stores/authStore';
import AIInsightCard from '../../components/AI/AIInsightCard';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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

export default function AIPerformanceManagement() {
  const navigate = useNavigate();
  const { user, employee } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [aiInsightDialog, setAiInsightDialog] = useState(false);
  const [developmentPlanDialog, setDevelopmentPlanDialog] = useState(false);
  const [careerPathDialog, setCareerPathDialog] = useState(false);

  const {
    generateGoalSuggestions,
    analyzePerformanceTrends,
    predictPerformance,
    generateDevelopmentPlan,
    analyzeSkillGaps,
    generateCareerPath,
    calculateRetentionRisk,
    detectBias
  } = useAIPerformance();

  const { data: performanceInsights } = usePerformanceInsights({
    employeeId: employee?._id,
    includeAI: true
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGenerateGoals = async () => {
    try {
      const result = await generateGoalSuggestions.mutateAsync({
        employeeId: employee?._id || '',
        role: employee?.companyDetails?.designation || '',
        department: employee?.companyDetails?.department || ''
      });
      
      console.log('AI Goal Suggestions:', result.data);
    } catch (error) {
      console.error('Goal generation failed:', error);
    }
  };

  const handleAnalyzeTrends = async () => {
    try {
      const result = await analyzePerformanceTrends.mutateAsync({
        employeeId: employee?._id || '',
        period: '12m'
      });
      
      console.log('Performance Trends:', result.data);
    } catch (error) {
      console.error('Trend analysis failed:', error);
    }
  };

  const handleGenerateDevelopmentPlan = async () => {
    try {
      const result = await generateDevelopmentPlan.mutateAsync({
        employeeId: employee?._id || '',
        careerGoals: ['Technical Leadership', 'Project Management']
      });
      
      setDevelopmentPlanDialog(true);
      console.log('Development Plan:', result.data);
    } catch (error) {
      console.error('Development plan generation failed:', error);
    }
  };

  const aiInsights = [
    {
      title: 'Performance Prediction',
      insight: 'Employee likely to exceed expectations by 15% next quarter',
      confidence: 0.89,
      type: 'success' as const,
      features: ['Historical performance', 'Goal progress', 'Peer comparison'],
      recommendations: ['Consider for stretch assignments', 'Prepare for promotion discussion']
    },
    {
      title: 'Skill Gap Analysis',
      insight: 'Critical skill gap identified in cloud architecture',
      confidence: 0.82,
      type: 'warning' as const,
      features: ['Job requirements', 'Current skills', 'Industry trends'],
      recommendations: ['Enroll in AWS certification', 'Assign cloud projects']
    },
    {
      title: 'Retention Risk',
      insight: 'Low retention risk - employee highly engaged',
      confidence: 0.91,
      type: 'info' as const,
      features: ['Engagement surveys', 'Performance trends', 'Career progression'],
      recommendations: ['Continue current development path', 'Consider leadership opportunities']
    }
  ];

  const performanceData = [
    { month: 'Jul', performance: 4.1, goals: 85, engagement: 78 },
    { month: 'Aug', performance: 4.3, goals: 88, engagement: 82 },
    { month: 'Sep', performance: 4.2, goals: 92, engagement: 85 },
    { month: 'Oct', performance: 4.4, goals: 95, engagement: 88 },
    { month: 'Nov', performance: 4.5, goals: 98, engagement: 90 },
    { month: 'Dec', performance: 4.6, goals: 100, engagement: 92 },
  ];

  const skillRadarData = [
    { skill: 'Technical', current: 85, target: 90, market: 80 },
    { skill: 'Leadership', current: 70, target: 85, market: 75 },
    { skill: 'Communication', current: 88, target: 90, market: 82 },
    { skill: 'Problem Solving', current: 92, target: 95, market: 85 },
    { skill: 'Collaboration', current: 86, target: 88, market: 83 },
    { skill: 'Innovation', current: 75, target: 85, market: 78 },
  ];

  const careerPathData = [
    {
      role: 'Senior Software Engineer',
      probability: 95,
      timeline: '6 months',
      requirements: ['Complete cloud certification', 'Lead 2 projects'],
      status: 'on-track'
    },
    {
      role: 'Tech Lead',
      probability: 78,
      timeline: '12 months',
      requirements: ['Mentoring experience', 'Architecture skills', 'Team leadership'],
      status: 'possible'
    },
    {
      role: 'Engineering Manager',
      probability: 45,
      timeline: '24 months',
      requirements: ['Management training', 'People skills', 'Business acumen'],
      status: 'stretch'
    }
  ];

  const developmentActions = [
    {
      type: 'Training',
      title: 'AWS Solutions Architect Certification',
      priority: 'high',
      timeline: '3 months',
      cost: 500,
      impact: 'High',
      status: 'recommended'
    },
    {
      type: 'Mentoring',
      title: 'Leadership Mentoring Program',
      priority: 'medium',
      timeline: '6 months',
      cost: 0,
      impact: 'Medium',
      status: 'available'
    },
    {
      type: 'Project',
      title: 'Lead Microservices Migration',
      priority: 'high',
      timeline: '4 months',
      cost: 0,
      impact: 'High',
      status: 'pending-approval'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'possible': return 'info';
      case 'stretch': return 'warning';
      case 'recommended': return 'success';
      case 'available': return 'info';
      case 'pending-approval': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            AI Performance Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered performance insights and career development
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Psychology />}
            onClick={handleGenerateGoals}
            disabled={generateGoalSuggestions.isPending}
          >
            AI Goal Suggestions
          </Button>
          <Button
            variant="contained"
            startIcon={<SelfImprovement />}
            onClick={handleGenerateDevelopmentPlan}
            disabled={generateDevelopmentPlan.isPending}
          >
            Generate Development Plan
          </Button>
        </Box>
      </Box>

      {/* AI Insights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {aiInsights.map((insight, index) => (
          <Grid item xs={12} md={4} key={index}>
            <AIInsightCard {...insight} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Performance Analytics" />
            <Tab label="Skill Development" />
            <Tab label="Career Pathways" />
            <Tab label="Team Insights" />
            <Tab label="Bias Detection" />
          </Tabs>
        </Box>

        {/* Performance Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Performance Trend Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="performance"
                          stroke="#1976d2"
                          strokeWidth={3}
                          name="Performance Rating"
                        />
                        <Line
                          type="monotone"
                          dataKey="goals"
                          stroke="#00796b"
                          strokeWidth={2}
                          name="Goal Completion %"
                        />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#f57c00"
                          strokeWidth={2}
                          name="Engagement %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    AI Predictions
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Next Quarter Performance</Typography>
                      <Typography variant="body2" fontWeight={600}>4.7/5.0</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={94}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <ConfidenceBadge confidence={0.89} />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Promotion Readiness</Typography>
                      <Typography variant="body2" fontWeight={600}>78%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={78}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <ConfidenceBadge confidence={0.82} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Retention Probability</Typography>
                      <Typography variant="body2" fontWeight={600}>92%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <ConfidenceBadge confidence={0.91} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Skill Development Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Skill Competency Radar
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#1976d2"
                          fill="#1976d2"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Target"
                          dataKey="target"
                          stroke="#00796b"
                          fill="#00796b"
                          fillOpacity={0.1}
                        />
                        <Radar
                          name="Market Avg"
                          dataKey="market"
                          stroke="#f57c00"
                          fill="transparent"
                          strokeDasharray="5 5"
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    AI Development Recommendations
                  </Typography>
                  
                  <List>
                    {developmentActions.map((action, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: getPriorityColor(action.priority) + '.main',
                            width: 32,
                            height: 32
                          }}>
                            {action.type === 'Training' ? <School /> :
                             action.type === 'Mentoring' ? <Person /> : <Work />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {action.title}
                              </Typography>
                              <Chip
                                label={action.priority}
                                size="small"
                                color={getPriorityColor(action.priority) as any}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {action.timeline} • Impact: {action.impact}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Cost: {action.cost > 0 ? `$${action.cost}` : 'Free'}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={action.status}
                            size="small"
                            color={getStatusColor(action.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Career Pathways Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      AI-Generated Career Paths
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Psychology />}
                      onClick={() => setCareerPathDialog(true)}
                    >
                      Generate New Path
                    </Button>
                  </Box>
                  
                  {careerPathData.map((path, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Avatar sx={{ bgcolor: getStatusColor(path.status) + '.main' }}>
                            <EmojiEvents />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {path.role}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {path.probability}% probability • {path.timeline}
                            </Typography>
                          </Box>
                          <Chip
                            label={path.status}
                            size="small"
                            color={getStatusColor(path.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="subtitle2" gutterBottom>
                          Requirements to Achieve:
                        </Typography>
                        <List dense>
                          {path.requirements.map((req, reqIndex) => (
                            <ListItem key={reqIndex}>
                              <ListItemIcon>
                                <CheckCircle sx={{ fontSize: 16 }} color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={req} />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Timeline />}
                          >
                            Create Development Plan
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Team Insights Tab */}
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Team Performance Insights:</strong> AI analysis of team dynamics, collaboration patterns, and collective performance trends.
            </Typography>
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Team Performance Distribution
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { rating: '5.0', count: 12 },
                        { rating: '4.5-4.9', count: 28 },
                        { rating: '4.0-4.4', count: 35 },
                        { rating: '3.5-3.9', count: 18 },
                        { rating: '3.0-3.4', count: 7 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Team Insights
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="High Performing Team"
                        secondary="85% of team members exceed expectations"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Psychology color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Skill Synergy Detected"
                        secondary="Strong complementary skills across team"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Knowledge Risk"
                        secondary="2 critical skills concentrated in single person"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Bias Detection Tab */}
        <TabPanel value={tabValue} index={4}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>AI Bias Detection:</strong> Advanced algorithms analyze performance reviews for potential bias patterns and ensure fair evaluations.
            </Typography>
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bias Analysis Results
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Gender Bias"
                        secondary="No significant bias detected (confidence: 94%)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Age Bias"
                        secondary="Slight bias detected in leadership ratings (confidence: 76%)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Department Bias"
                        secondary="Fair distribution across departments (confidence: 91%)"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommended Actions
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <GpsFixed color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Calibration Review"
                        secondary="Review age-related leadership assessments"
                      />
                      <ListItemSecondaryAction>
                        <Button size="small" variant="outlined">
                          Review
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <School color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Bias Training"
                        secondary="Recommend unconscious bias training for managers"
                      />
                      <ListItemSecondaryAction>
                        <Button size="small" variant="outlined">
                          Schedule
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Development Plan Dialog */}
      <Dialog
        open={developmentPlanDialog}
        onClose={() => setDevelopmentPlanDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            AI-Generated Development Plan
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            AI has analyzed your performance data and generated a personalized development plan.
          </Alert>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Development Action</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {developmentActions.map((action, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {action.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={action.type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={action.priority}
                        size="small"
                        color={getPriorityColor(action.priority) as any}
                      />
                    </TableCell>
                    <TableCell>{action.timeline}</TableCell>
                    <TableCell>{action.impact}</TableCell>
                    <TableCell>
                      {action.cost > 0 ? `$${action.cost}` : 'Free'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={action.status}
                        size="small"
                        color={getStatusColor(action.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDevelopmentPlanDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Send />}>
            Approve & Implement Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Career Path Dialog */}
      <Dialog
        open={careerPathDialog}
        onClose={() => setCareerPathDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Generate AI Career Path
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Role"
                value={employee?.companyDetails?.designation || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Career Aspirations</InputLabel>
                <Select multiple label="Career Aspirations">
                  <MenuItem value="technical-leadership">Technical Leadership</MenuItem>
                  <MenuItem value="people-management">People Management</MenuItem>
                  <MenuItem value="product-management">Product Management</MenuItem>
                  <MenuItem value="architecture">Solution Architecture</MenuItem>
                  <MenuItem value="consulting">Technical Consulting</MenuItem>
                  <MenuItem value="entrepreneurship">Entrepreneurship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Target Timeline (months)"
                defaultValue={12}
                inputProps={{ min: 6, max: 60 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCareerPathDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Psychology />}
            onClick={() => {
              setCareerPathDialog(false);
              // Generate career path logic here
            }}
          >
            Generate Path
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}