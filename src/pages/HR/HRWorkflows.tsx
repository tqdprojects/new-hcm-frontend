import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  BeachAccess,
  Star,
  Work,
  CheckCircle,
  Schedule,
  Warning,
  PersonAdd,
  Assignment,
} from '@mui/icons-material';
import { useRealTimeData } from '../../hooks/useRealTimeData';

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

export default function HRWorkflows() {
  const [tabValue, setTabValue] = useState(0);
  const [actionDialog, setActionDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [comments, setComments] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Real-time HR workflow data
  const { data: workflowData } = useRealTimeData({
    queryKeys: [['hr-workflows']],
    events: ['hr:workflow-update', 'approval:required'],
    endpoint: '/hr/workflows',
  });

  const pendingOnboarding = [
    {
      id: '1',
      employee: 'Alice Johnson',
      position: 'Software Engineer',
      department: 'Engineering',
      startDate: '2024-12-10',
      status: 'documents-pending',
      progress: 75,
      assignedTo: 'HR Specialist',
    },
    {
      id: '2',
      employee: 'Bob Wilson',
      position: 'Sales Manager',
      department: 'Sales',
      startDate: '2024-12-15',
      status: 'background-check',
      progress: 60,
      assignedTo: 'HR Manager',
    },
  ];

  const pendingReviews = [
    {
      id: '1',
      employee: 'John Doe',
      reviewer: 'Jane Smith',
      type: 'Annual Review',
      dueDate: '2024-12-20',
      status: 'manager-review',
      progress: 80,
    },
    {
      id: '2',
      employee: 'Sarah Wilson',
      reviewer: 'Mike Johnson',
      type: 'Probation Review',
      dueDate: '2024-12-25',
      status: 'self-assessment',
      progress: 40,
    },
  ];

  const recruitmentPipeline = [
    {
      position: 'Senior Developer',
      applications: 45,
      screening: 12,
      interviews: 5,
      offers: 2,
      hired: 1,
    },
    {
      position: 'Product Manager',
      applications: 32,
      screening: 8,
      interviews: 3,
      offers: 1,
      hired: 0,
    },
  ];

  const hrMetrics = {
    activeOnboarding: pendingOnboarding.length,
    pendingReviews: pendingReviews.length,
    openPositions: recruitmentPipeline.length,
    avgOnboardingTime: 7.5,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            HR Workflows
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage HR processes and employee lifecycle workflows
          </Typography>
        </Box>
      </Box>

      {/* HR Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {hrMetrics.activeOnboarding}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Onboarding
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {hrMetrics.pendingReviews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Reviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {hrMetrics.openPositions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Positions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {hrMetrics.avgOnboardingTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Onboarding (days)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflow Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Onboarding" />
            <Tab label="Performance Reviews" />
            <Tab label="Recruitment" />
            <Tab label="Employee Lifecycle" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Active Onboarding Processes
          </Typography>
          <List>
            {pendingOnboarding.map((item) => (
              <ListItem key={item.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonAdd />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.employee} - {item.position}
                      </Typography>
                      <Chip
                        label={item.status.replace('-', ' ')}
                        size="small"
                        color={getStatusColor(item.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.department} • Start Date: {item.startDate} • Assigned to: {item.assignedTo}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption">Progress: {item.progress}%</Typography>
                        <Box sx={{ flexGrow: 1, mx: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.progress}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSelectedItem(item);
                    setActionDialog(true);
                  }}
                >
                  Manage
                </Button>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Performance Review Status
          </Typography>
          <List>
            {pendingReviews.map((review) => (
              <ListItem key={review.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Star />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.employee} - {review.type}
                      </Typography>
                      <Chip
                        label={review.status.replace('-', ' ')}
                        size="small"
                        color={getStatusColor(review.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Reviewer: {review.reviewer} • Due: {review.dueDate}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption">Progress: {review.progress}%</Typography>
                        <Box sx={{ flexGrow: 1, mx: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={review.progress}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recruitment Pipeline
          </Typography>
          {recruitmentPipeline.map((position, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {position.position}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600}>
                        {position.applications}
                      </Typography>
                      <Typography variant="caption">Applications</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600}>
                        {position.screening}
                      </Typography>
                      <Typography variant="caption">Screening</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600}>
                        {position.interviews}
                      </Typography>
                      <Typography variant="caption">Interviews</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600}>
                        {position.offers}
                      </Typography>
                      <Typography variant="caption">Offers</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={600} color="success.main">
                        {position.hired}
                      </Typography>
                      <Typography variant="caption">Hired</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                    >
                      Manage
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Employee Lifecycle Management
          </Typography>
          <Alert severity="info">
            Employee lifecycle workflows including promotions, transfers, and separations will be displayed here.
          </Alert>
        </TabPanel>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog}
        onClose={() => setActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Manage Workflow - {selectedItem?.employee}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Current Status: {selectedItem.status?.replace('-', ' ')}
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Action Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add comments for this action..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('Processing workflow action:', selectedItem, comments);
              setActionDialog(false);
              setSelectedItem(null);
              setComments('');
            }}
          >
            Process Action
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}