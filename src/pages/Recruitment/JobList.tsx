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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Work,
  Psychology,
  Assessment,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCandidateShortlist, useAIHealth } from '../../hooks/useAI';
import AIInsightCard from '../../components/AI/AIInsightCard';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';

export default function JobList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [aiShortlistDialog, setAiShortlistDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const canManageJobs = ['hr', 'manager', 'tenant-admin'].includes(user?.role || '');
  
  const generateShortlist = useCandidateShortlist();
  const { data: aiHealthResponse } = useAIHealth();

  // Mock data for demonstration
  const jobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      status: 'published',
      applicationsCount: 24,
      publishedAt: '2024-12-01',
      salaryRange: { min: 120000, max: 160000, currency: 'USD' },
      aiInsights: {
        skillDemand: 'high',
        marketCompetitiveness: 85,
        expectedApplications: 30
      }
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      status: 'published',
      applicationsCount: 18,
      publishedAt: '2024-11-28',
      salaryRange: { min: 100000, max: 130000, currency: 'USD' },
      aiInsights: {
        skillDemand: 'medium',
        marketCompetitiveness: 78,
        expectedApplications: 25
      }
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      status: 'draft',
      applicationsCount: 0,
      publishedAt: null,
      salaryRange: { min: 80000, max: 110000, currency: 'USD' },
      aiInsights: {
        skillDemand: 'high',
        marketCompetitiveness: 92,
        expectedApplications: 35
      }
    },
  ];

  const handleGenerateShortlist = async (job: any) => {
    setSelectedJob(job);
    await generateShortlist.mutateAsync({ jobId: job.id, topK: 10 });
    setAiShortlistDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
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
      field: 'experienceLevel',
      headerName: 'Level',
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
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'applicationsCount',
      headerName: 'Applications',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
          {params.row.aiInsights && (
            <Tooltip title={`AI Prediction: ${params.row.aiInsights.expectedApplications} expected`}>
              <Psychology sx={{ fontSize: 16, color: 'primary.main' }} />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: 'salaryRange',
      headerName: 'Salary Range',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            ${params.row.salaryRange.min.toLocaleString()} - ${params.row.salaryRange.max.toLocaleString()}
          </Typography>
          {params.row.aiInsights && (
            <ConfidenceBadge 
              confidence={params.row.aiInsights.marketCompetitiveness / 100} 
              showIcon={false}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'publishedAt',
      headerName: 'Published',
      width: 120,
      renderCell: (params) => 
        params.value ? new Date(params.value).toLocaleDateString() : '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/recruitment/jobs/${params.row.id}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          {canManageJobs && (
            <>
              <Tooltip title="Edit Job">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/recruitment/jobs/${params.row.id}/edit`)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              
              {params.row.applicationsCount > 0 && (
                <Tooltip title="AI Shortlist">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedJob(params.row);
                      setAiShortlistDialog(true);
                    }}
                  >
                    <Psychology />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Delete Job">
                <IconButton
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Job Postings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage job openings and track applications with AI insights
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {aiHealthResponse?.data?.status === 'healthy' && (
            <Chip
              icon={<Psychology />}
              label="AI Enabled"
              color="success"
              variant="outlined"
            />
          )}
          {canManageJobs && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/recruitment/jobs/add')}
            >
              Post New Job
            </Button>
          )}
        </Box>
      </Box>

      {/* AI Insights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <AIInsightCard
            title="High Demand Skills"
            insight="React, Node.js, and AWS skills are in high demand"
            confidence={0.89}
            type="info"
            features={['Job postings', 'Market trends', 'Application rates']}
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AIInsightCard
            title="Competitive Salary Alert"
            insight="UX Designer salary 15% below market average"
            confidence={0.92}
            type="warning"
            features={['Salary benchmarks', 'Application rates', 'Market data']}
            icon={Assessment}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AIInsightCard
            title="Talent Pool Analysis"
            insight="Senior engineers: 40% increase in available candidates"
            confidence={0.85}
            type="success"
            features={['Application trends', 'Market analysis', 'Skill availability']}
            icon={People}
          />
        </Grid>
      </Grid>

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
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setStatusFilter('');
                  setDepartmentFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={jobs}
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

      {/* AI Shortlist Dialog */}
      <Dialog
        open={aiShortlistDialog}
        onClose={() => setAiShortlistDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            Generate AI Shortlist
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                AI will analyze all candidates for "{selectedJob.title}" and generate a ranked shortlist based on resume-job relevance.
              </Alert>
              
              <Typography variant="body2" gutterBottom>
                <strong>Job:</strong> {selectedJob.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Applications:</strong> {selectedJob.applicationsCount}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Expected Top Candidates:</strong> 5-10
              </Typography>
              
              <TextField
                fullWidth
                label="Number of Candidates"
                type="number"
                defaultValue={10}
                inputProps={{ min: 1, max: 50 }}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiShortlistDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Psychology />}
            onClick={() => selectedJob && handleGenerateShortlist(selectedJob)}
            disabled={generateShortlist.isPending}
          >
            {generateShortlist.isPending ? 'Analyzing...' : 'Generate Shortlist'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}