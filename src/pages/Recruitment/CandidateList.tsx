import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Psychology,
  Assessment,
  Schedule,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useResumeRelevance, useInterviewGuide } from '../../hooks/useAI';
import AIInsightCard from '../../components/AI/AIInsightCard';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';
import WhyPopover from '../../components/AI/WhyPopover';

export default function CandidateList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [aiAnalysisDialog, setAiAnalysisDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const resumeRelevance = useResumeRelevance();
  const interviewGuide = useInterviewGuide();

  // Mock data with AI analysis
  const candidates = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      jobTitle: 'Senior Software Engineer',
      experience: 6,
      currentStage: 'interview',
      status: 'interview',
      appliedAt: '2024-12-01',
      source: 'linkedin',
      aiAnalysis: {
        overallScore: 87,
        skillsMatch: 92,
        experienceMatch: 85,
        strengths: ['React expertise', 'System design', 'Team leadership'],
        gaps: ['GraphQL', 'Microservices'],
        recommendation: 'Strong candidate - proceed to technical interview',
        confidence: 0.89
      }
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      jobTitle: 'Senior Software Engineer',
      experience: 4,
      currentStage: 'screening',
      status: 'screening',
      appliedAt: '2024-11-30',
      source: 'website',
      aiAnalysis: {
        overallScore: 73,
        skillsMatch: 78,
        experienceMatch: 70,
        strengths: ['Frontend development', 'UI/UX collaboration'],
        gaps: ['Backend experience', 'Database design', 'DevOps'],
        recommendation: 'Good candidate with potential - consider for mid-level role',
        confidence: 0.82
      }
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0125',
      jobTitle: 'Senior Software Engineer',
      experience: 8,
      currentStage: 'technical',
      status: 'interview',
      appliedAt: '2024-11-28',
      source: 'referral',
      aiAnalysis: {
        overallScore: 94,
        skillsMatch: 96,
        experienceMatch: 92,
        strengths: ['Full-stack expertise', 'Architecture design', 'Mentoring'],
        gaps: ['Domain knowledge'],
        recommendation: 'Exceptional candidate - fast-track to final round',
        confidence: 0.95
      }
    },
  ];

  const handleAnalyzeCandidate = async (candidate: any) => {
    setSelectedCandidate(candidate);
    setAiAnalysisDialog(true);
  };

  const handleGenerateInterviewGuide = async (candidate: any) => {
    await interviewGuide.mutateAsync({ 
      candidateId: candidate.id, 
      seniority: candidate.experience >= 5 ? 'senior' : 'mid' 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const columns: GridColDef[] = [
    {
      field: 'candidate',
      headerName: 'Candidate',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.experience} years exp
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'jobTitle',
      headerName: 'Applied For',
      width: 180,
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
            color={getScoreColor(params.row.aiAnalysis?.overallScore || 0) as any}
          />
          {params.row.aiAnalysis && (
            <WhyPopover
              title="AI Analysis"
              explanation={params.row.aiAnalysis.recommendation}
              features={[...params.row.aiAnalysis.strengths, ...params.row.aiAnalysis.gaps]}
              modelVersion="resume-matcher-v1.0"
              confidence={params.row.aiAnalysis.confidence}
              recommendations={[params.row.aiAnalysis.recommendation]}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'currentStage',
      headerName: 'Stage',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
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
          color={params.value === 'interview' ? 'warning' : 'info'}
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
          label={params.value}
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
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => navigate(`/recruitment/candidates/${params.row.id}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="AI Analysis">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleAnalyzeCandidate(params.row)}
            >
              <Psychology />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Generate Interview Guide">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleGenerateInterviewGuide(params.row)}
            >
              <Assessment />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Schedule Interview">
            <IconButton
              size="small"
              onClick={() => navigate(`/recruitment/interviews/schedule/${params.row.id}`)}
            >
              <Schedule />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Candidates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage job applications with AI-powered insights
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="applied">Applied</MenuItem>
                  <MenuItem value="screening">Screening</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="selected">Selected</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  label="Stage"
                >
                  <MenuItem value="">All Stages</MenuItem>
                  <MenuItem value="application">Application</MenuItem>
                  <MenuItem value="screening">Screening</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="final">Final</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={candidates}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* AI Analysis Dialog */}
      <Dialog
        open={aiAnalysisDialog}
        onClose={() => setAiAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          AI Candidate Analysis - {selectedCandidate?.firstName} {selectedCandidate?.lastName}
        </DialogTitle>
        <DialogContent>
          {selectedCandidate?.aiAnalysis && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        {selectedCandidate.aiAnalysis.overallScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Match
                      </Typography>
                      <ConfidenceBadge confidence={selectedCandidate.aiAnalysis.confidence} />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {selectedCandidate.aiAnalysis.skillsMatch}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Skills Match
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        {selectedCandidate.aiAnalysis.experienceMatch}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Experience Match
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                    Strengths
                  </Typography>
                  <List dense>
                    {selectedCandidate.aiAnalysis.strengths.map((strength: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUp color="success" />
                        </ListItemIcon>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    <Warning sx={{ fontSize: 16, color: 'warning.main', mr: 1 }} />
                    Skill Gaps
                  </Typography>
                  <List dense>
                    {selectedCandidate.aiAnalysis.gaps.map((gap: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingDown color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={gap} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>AI Recommendation:</strong> {selectedCandidate.aiAnalysis.recommendation}
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiAnalysisDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={() => selectedCandidate && handleGenerateInterviewGuide(selectedCandidate)}
          >
            Generate Interview Guide
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}