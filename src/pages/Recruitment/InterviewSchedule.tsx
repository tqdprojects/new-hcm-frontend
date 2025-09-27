import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Rating,
} from '@mui/material';
import {
  Add,
  Schedule,
  Psychology,
  Assessment,
  ExpandMore,
  VideoCall,
  Phone,
  LocationOn,
  Timer,
  Star,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { useInterviewGuide } from '../../hooks/useAI';
import ConfidenceBadge from '../../components/AI/ConfidenceBadge';
import { Tooltip } from '@mui/material';

export default function InterviewSchedule() {
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [guideDialog, setGuideDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [interviewGuideData, setInterviewGuideData] = useState<any>(null);

  const interviewGuide = useInterviewGuide();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mock data
  const interviews = [
    {
      id: '1',
      candidateName: 'John Smith',
      jobTitle: 'Senior Software Engineer',
      scheduledAt: '2024-12-05T14:00:00Z',
      duration: 60,
      mode: 'video-call',
      interviewers: ['Jane Doe', 'Mike Johnson'],
      status: 'scheduled',
      round: 1,
      aiGuideGenerated: true,
    },
    {
      id: '2',
      candidateName: 'Sarah Johnson',
      jobTitle: 'Senior Software Engineer',
      scheduledAt: '2024-12-06T10:00:00Z',
      duration: 45,
      mode: 'in-person',
      interviewers: ['Jane Doe'],
      status: 'scheduled',
      round: 1,
      aiGuideGenerated: false,
    },
  ];

  const handleGenerateGuide = async (interview: any) => {
    const result = await interviewGuide.mutateAsync({
      candidateId: interview.candidateId,
      seniority: 'senior'
    });
    setInterviewGuideData(result.data);
    setGuideDialog(true);
  };

  const onSubmit = (data: any) => {
    console.log('Scheduling interview:', data);
    setScheduleDialog(false);
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'warning';
      default: return 'default';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video-call': return <VideoCall />;
      case 'phone': return <Phone />;
      case 'in-person': return <LocationOn />;
      default: return <Schedule />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'candidate',
      headerName: 'Candidate',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.candidateName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.jobTitle}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'scheduledAt',
      headerName: 'Scheduled Time',
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(params.value).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'mode',
      headerName: 'Mode',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getModeIcon(params.value)}
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {params.value.replace('-', ' ')}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 100,
      renderCell: (params) => `${params.value} min`,
    },
    {
      field: 'interviewers',
      headerName: 'Interviewers',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value.join(', ')}
        </Typography>
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
          color={getStatusColor(params.value) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {!params.row.aiGuideGenerated && (
            <Tooltip title="Generate AI Guide">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleGenerateGuide(params.row)}
              >
                <Psychology />
              </IconButton>
            </Tooltip>
          )}
          
          {params.row.aiGuideGenerated && (
            <Tooltip title="View AI Guide">
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  setSelectedInterview(params.row);
                  setGuideDialog(true);
                }}
              >
                <Assessment />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Interview Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage interviews with AI-generated guides and questions
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setScheduleDialog(true)}
        >
          Schedule Interview
        </Button>
      </Box>

      {/* Interviews Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={interviews}
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

      {/* Schedule Interview Dialog */}
      <Dialog
        open={scheduleDialog}
        onClose={() => setScheduleDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Candidate</InputLabel>
                  <Select label="Candidate">
                    <MenuItem value="1">John Smith - Senior Software Engineer</MenuItem>
                    <MenuItem value="2">Sarah Johnson - Senior Software Engineer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="scheduledAt"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Interview Date & Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: { fullWidth: true }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Interview Mode</InputLabel>
                  <Select label="Interview Mode">
                    <MenuItem value="video-call">Video Call</MenuItem>
                    <MenuItem value="in-person">In Person</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  defaultValue={60}
                  inputProps={{ min: 15, max: 240 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Interviewers</InputLabel>
                  <Select multiple label="Interviewers">
                    <MenuItem value="1">Jane Doe - Engineering Manager</MenuItem>
                    <MenuItem value="2">Mike Johnson - Senior Engineer</MenuItem>
                    <MenuItem value="3">Lisa Chen - Tech Lead</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    An AI-powered interview guide will be automatically generated after scheduling.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Interview Guide Dialog */}
      <Dialog
        open={guideDialog}
        onClose={() => setGuideDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            AI Interview Guide
            <ConfidenceBadge confidence={0.88} />
          </Box>
        </DialogTitle>
        <DialogContent>
          {interviewGuideData && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Interview Questions
                  </Typography>
                  
                  {interviewGuideData.questions?.map((question: any, index: number) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Chip
                            label={question.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                            {question.question}
                          </Typography>
                          <Chip
                            icon={<Timer />}
                            label={`${question.timeAllocation}m`}
                            size="small"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Expected Answer:</strong>
                            </Typography>
                            <Typography variant="body2">
                              {question.expectedAnswer}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Evaluation Criteria:</strong>
                            </Typography>
                            <List dense>
                              {question.evaluationCriteria?.map((criteria: string, idx: number) => (
                                <ListItem key={idx}>
                                  <ListItemText primary={criteria} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Evaluation Rubric
                  </Typography>
                  
                  {interviewGuideData.rubric?.map((rubric: any, index: number) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          {rubric.criteria} ({rubric.weight}%)
                        </Typography>
                        
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="success.main">
                            <Star sx={{ fontSize: 12 }} /> Excellent: {rubric.excellent}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="info.main">
                            Good: {rubric.good}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="warning.main">
                            Average: {rubric.average}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="error.main">
                            Poor: {rubric.poor}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  <Typography variant="subtitle2" gutterBottom>
                    Focus Areas
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {interviewGuideData.focusAreas?.map((area: string, index: number) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGuideDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Assessment />}>
            Start Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}