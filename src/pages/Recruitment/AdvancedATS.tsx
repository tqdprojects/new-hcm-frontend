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
} from '@mui/material';
import {
  Psychology,
  Assessment,
  Schedule,
  Person,
  Work,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Visibility,
  Edit,
  Delete,
  Add,
  FilterList,
  Download,
  Upload,
  Send,
  Star,
  Timeline,
  Analytics,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useRecruitmentData, useAIRecruitment } from '../../hooks/useRecruitment';
import { useNotificationStore } from '../../stores/notificationStore';
import AIInsightCard from '../../components/AI/AIInsightCard';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';

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

export default function AdvancedATS() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [tabValue, setTabValue] = useState(0);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [aiAnalysisDialog, setAiAnalysisDialog] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const { 
    jobs, 
    candidates, 
    interviews, 
    assessments,
    recruitmentAnalytics,
    isLoading 
  } = useRecruitmentData();

  const {
    generateShortlist,
    analyzeResume,
    generateInterviewQuestions,
    predictCandidateSuccess,
    detectAnomalies
  } = useAIRecruitment();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAIShortlist = async (job: any) => {
    try {
      const result = await generateShortlist.mutateAsync({
        jobId: job._id,
        criteria: {
          minScore: 70,
          maxCandidates: 10,
          includeAIAnalysis: true
        }
      });
      
      addNotification({
        title: 'AI Shortlist Generated',
        message: `Generated shortlist of ${result.data.length} candidates`,
        type: 'success'
      });
    } catch (error) {
      console.error('AI shortlist failed:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      console.log(`Performing bulk action: ${action} on candidates:`, selectedCandidates);
      setBulkActionDialog(false);
      setSelectedCandidates([]);
      
      addNotification({
        title: 'Bulk Action Completed',
        message: `${action} applied to ${selectedCandidates.length} candidates`,
        type: 'success'
      });
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const pipelineStages = [
    { stage: 'Applied', count: 245, color: 'info' },
    { stage: 'Screening', count: 89, color: 'warning' },
    { stage: 'Assessment', count: 45, color: 'primary' },
    { stage: 'Interview', count: 23, color: 'secondary' },
    { stage: 'Reference', count: 12, color: 'success' },
    { stage: 'Offer', count: 8, color: 'success' },
    { stage: 'Hired', count: 5, color: 'success' },
  ];

  const aiInsights = [
    {
      title: 'High-Quality Candidates Identified',
      insight: '15 candidates with 90%+ match score for Senior Developer role',
      confidence: 0.92,
      type: 'success' as const,
      features: ['Resume analysis', 'Skill matching', 'Experience validation'],
      recommendations: ['Fast-track these candidates', 'Schedule technical interviews']
    },
    {
      title: 'Bias Detection Alert',
      insight: 'Potential gender bias detected in screening process',
      confidence: 0.78,
      type: 'warning' as const,
      features: ['Screening patterns', 'Historical data', 'Demographic analysis'],
      recommendations: ['Review screening criteria', 'Implement blind screening']
    },
    {
      title: 'Time-to-Hire Optimization',
      insight: 'Average time-to-hire can be reduced by 8 days with AI screening',
      confidence: 0.85,
      type: 'info' as const,
      features: ['Process analysis', 'Bottleneck identification', 'Automation potential'],
      recommendations: ['Enable auto-screening', 'Streamline interview process']
    }
  ];

  const jobColumns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Job Title',
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.department} • {params.row.location}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'pipeline',
      headerName: 'Pipeline',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.row.applicationsCount} applications
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(params.row.pipeline?.hired / params.row.headcount) * 100}
            sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            {params.row.pipeline?.hired}/{params.row.headcount} hired
          </Typography>
        </Box>
      ),
    },
    {
      field: 'aiScore',
      headerName: 'AI Insights',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          <ConfidenceBadge confidence={0.85} showIcon={false} />
          <Tooltip title="View AI Analysis">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedJob(params.row);
                setAiAnalysisDialog(true);
              }}
            >
              <Analytics />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'published' ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="AI Shortlist">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleAIShortlist(params.row)}
            >
              <Psychology />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/recruitment/jobs/${params.row._id}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Job">
            <IconButton
              size="small"
              onClick={() => navigate(`/recruitment/jobs/${params.row._id}/edit`)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const candidateColumns: GridColDef[] = [
    {
      field: 'candidate',
      headerName: 'Candidate',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.personalDetails?.firstName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.row.personalDetails?.firstName} {params.row.personalDetails?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.professionalDetails?.totalExperience}y exp
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'aiScore',
      headerName: 'AI Score',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${params.row.aiAnalysis?.overallScore || 0}%`}
            size="small"
            color={
              (params.row.aiAnalysis?.overallScore || 0) >= 80 ? 'success' :
              (params.row.aiAnalysis?.overallScore || 0) >= 60 ? 'warning' : 'error'
            }
          />
          <ConfidenceBadge confidence={params.row.aiAnalysis?.confidence || 0} showIcon={false} />
        </Box>
      ),
    },
    {
      field: 'stage',
      headerName: 'Stage',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.currentStage?.replace('-', ' ')}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'source',
      headerName: 'Source',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.source}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'appliedAt',
      headerName: 'Applied',
      width: 120,
      renderCell: (params) => new Date(params.row.appliedAt).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Advanced ATS
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered applicant tracking system with advanced analytics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Upload />}
          >
            Import Candidates
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/recruitment/jobs/create')}
          >
            Create Job
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

      {/* Pipeline Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recruitment Pipeline
          </Typography>
          <Grid container spacing={2}>
            {pipelineStages.map((stage, index) => (
              <Grid item xs={12} sm={6} md key={index}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" fontWeight={600} color={`${stage.color}.main`}>
                      {stage.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stage.stage}
                    </Typography>
                    {index > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((stage.count / pipelineStages[index - 1].count) * 100)}% conversion
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Active Jobs" />
            <Tab label="Candidates" />
            <Tab label="Interviews" />
            <Tab label="Assessments" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Active Jobs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Active Job Postings
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Psychology />}
                onClick={() => {
                  addNotification({
                    title: 'AI Analysis Started',
                    message: 'Analyzing all active jobs for optimization opportunities',
                    type: 'info'
                  });
                }}
              >
                AI Optimize All
              </Button>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => navigate('/recruitment/jobs/create')}
              >
                Create Job
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={jobs}
              columns={jobColumns}
              loading={isLoading}
              getRowId={(row) => row._id}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(selection) => {
                console.log('Selected jobs:', selection);
              }}
            />
          </Box>
        </TabPanel>

        {/* Candidates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Candidate Pool
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Psychology />}
                disabled={selectedCandidates.length === 0}
                onClick={() => setBulkActionDialog(true)}
              >
                AI Bulk Actions
              </Button>
              <Button
                size="small"
                startIcon={<Download />}
              >
                Export
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={candidates}
              columns={candidateColumns}
              loading={isLoading}
              getRowId={(row) => row._id}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(selection) => {
                setSelectedCandidates(selection as string[]);
              }}
            />
          </Box>
        </TabPanel>

        {/* Interviews Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Interview Schedule
            </Typography>
            <Button
              size="small"
              startIcon={<Schedule />}
              onClick={() => navigate('/recruitment/interviews/schedule')}
            >
              Schedule Interview
            </Button>
          </Box>
          
          <List>
            {interviews.slice(0, 5).map((interview, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Schedule />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {interview.candidateName} - {interview.jobTitle}
                      </Typography>
                      <Chip
                        label={interview.type}
                        size="small"
                        variant="outlined"
                      />
                      {interview.aiGuideGenerated && (
                        <Chip
                          icon={<Psychology />}
                          label="AI Guide"
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {new Date(interview.scheduledAt).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Interviewers: {interview.interviewers.join(', ')}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/recruitment/interviews/${interview.id}`)}
                  >
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Assessments Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Candidate Assessments
            </Typography>
            <Button
              size="small"
              startIcon={<Assessment />}
              onClick={() => navigate('/recruitment/assessments/create')}
            >
              Create Assessment
            </Button>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Assessment Type</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessments.slice(0, 10).map((assessment) => (
                  <TableRow key={assessment.id} hover>
                    <TableCell>{assessment.candidateName}</TableCell>
                    <TableCell>
                      <Chip
                        label={assessment.type}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {assessment.score ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {assessment.score}/{assessment.maxScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({Math.round((assessment.score / assessment.maxScore) * 100)}%)
                          </Typography>
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assessment.status}
                        size="small"
                        color={
                          assessment.status === 'completed' ? 'success' :
                          assessment.status === 'in-progress' ? 'warning' : 'info'
                        }
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/recruitment/assessments/${assessment.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recruitment Metrics
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Average Time to Hire"
                        secondary="18.5 days"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Cost per Hire"
                        secondary="$3,250"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Offer Acceptance Rate"
                        secondary="87.5%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Quality of Hire"
                        secondary="4.2/5.0"
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
                    AI Performance
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Resume Matching Accuracy"
                        secondary="94.2%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Screening Automation"
                        secondary="78% automated"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Bias Reduction"
                        secondary="65% improvement"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Time Savings"
                        secondary="12 hours/week"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* AI Analysis Dialog */}
      <Dialog
        open={aiAnalysisDialog}
        onClose={() => setAiAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            AI Job Analysis - {selectedJob?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                AI analysis provides insights on job performance, candidate quality, and optimization opportunities.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Job Performance Metrics
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Application Rate"
                        secondary="15.2 applications/day"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Quality Score"
                        secondary="78% high-quality candidates"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Conversion Rate"
                        secondary="12% application to hire"
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    AI Recommendations
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Optimize job description"
                        secondary="Add specific skill requirements"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Adjust salary range"
                        secondary="15% below market average"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Enable auto-screening"
                        secondary="Save 8 hours/week"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiAnalysisDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Psychology />}>
            Apply AI Recommendations
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog
        open={bulkActionDialog}
        onClose={() => setBulkActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Bulk AI Actions ({selectedCandidates.length} candidates)
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Psychology />}
                onClick={() => handleBulkAction('AI Analysis')}
                sx={{ mb: 1 }}
              >
                Run AI Analysis
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => handleBulkAction('Schedule Assessment')}
                sx={{ mb: 1 }}
              >
                Schedule Assessments
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Schedule />}
                onClick={() => handleBulkAction('Schedule Interview')}
                sx={{ mb: 1 }}
              >
                Bulk Schedule Interviews
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleBulkAction('Reject')}
              >
                Bulk Reject
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}