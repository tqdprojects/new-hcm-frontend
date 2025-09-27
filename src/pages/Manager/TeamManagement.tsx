import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Star,
  TrendingUp,
  Schedule,
  Assignment,
  CheckCircle,
  Warning,
  PersonAdd,
  Assessment,
  SelfImprovement,
} from '@mui/icons-material';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useAuthStore } from '../../stores/authStore';

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

export default function TeamManagement() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [oneOnOneDialog, setOneOnOneDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [meetingNotes, setMeetingNotes] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Real-time team data
  const { data: teamData } = useRealTimeData({
    queryKeys: [['team-data', user?._id]],
    events: ['team:update', 'performance:update'],
    endpoint: `/manager/team/${user?._id}`,
  });

  const teamMembers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      designation: 'Senior Developer',
      department: 'Engineering',
      joiningDate: '2023-01-15',
      status: 'active',
      performance: {
        currentRating: 4.2,
        goalsCompleted: 8,
        totalGoals: 10,
        lastReviewDate: '2024-09-15',
      },
      attendance: {
        thisMonth: 96.5,
        avgHours: 8.2,
        lateCount: 2,
      },
      avatar: 'JS',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      designation: 'Frontend Developer',
      department: 'Engineering',
      joiningDate: '2023-03-20',
      status: 'active',
      performance: {
        currentRating: 4.0,
        goalsCompleted: 6,
        totalGoals: 8,
        lastReviewDate: '2024-09-20',
      },
      attendance: {
        thisMonth: 98.2,
        avgHours: 8.0,
        lateCount: 0,
      },
      avatar: 'SW',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      designation: 'Backend Developer',
      department: 'Engineering',
      joiningDate: '2022-11-10',
      status: 'on-leave',
      performance: {
        currentRating: 3.8,
        goalsCompleted: 5,
        totalGoals: 9,
        lastReviewDate: '2024-08-10',
      },
      attendance: {
        thisMonth: 85.0,
        avgHours: 7.5,
        lateCount: 1,
      },
      avatar: 'MJ',
    },
  ];

  const teamMetrics = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    avgPerformance: 4.0,
    avgAttendance: 93.2,
    pendingReviews: 2,
    upcomingOneOnOnes: 3,
  };

  const upcomingOneOnOnes = [
    {
      employee: 'John Smith',
      date: '2024-12-05',
      time: '2:00 PM',
      type: 'Regular Check-in',
      agenda: 'Project progress, career development',
    },
    {
      employee: 'Sarah Wilson',
      date: '2024-12-06',
      time: '10:00 AM',
      type: 'Performance Review',
      agenda: 'Q4 performance discussion',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'on-leave': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const scheduleOneOnOne = (employee: any) => {
    setSelectedEmployee(employee);
    setOneOnOneDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Team Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your team's performance, attendance, and development
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
        >
          Request New Hire
        </Button>
      </Box>

      {/* Team Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {teamMetrics.totalMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {teamMetrics.activeMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="secondary.main">
                {teamMetrics.avgPerformance}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="info.main">
                {teamMetrics.avgAttendance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {teamMetrics.pendingReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="error.main">
                {teamMetrics.upcomingOneOnOnes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming 1:1s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Team Overview" />
            <Tab label="Performance" />
            <Tab label="One-on-Ones" />
            <Tab label="Development" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {member.avatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.designation}
                        </Typography>
                      </Box>
                      <Chip
                        label={member.status}
                        size="small"
                        color={getStatusColor(member.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Performance
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                          <Typography variant="body1" fontWeight={600}>
                            {member.performance.currentRating}/5
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Attendance
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {member.attendance.thisMonth}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Goal Progress: {member.performance.goalsCompleted}/{member.performance.totalGoals}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(member.performance.goalsCompleted / member.performance.totalGoals) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<SelfImprovement />}
                      onClick={() => scheduleOneOnOne(member)}
                    >
                      Schedule 1:1
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Team Performance Overview
          </Typography>
          {/* Performance content */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Upcoming One-on-Ones
          </Typography>
          <List>
            {upcomingOneOnOnes.map((meeting, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <SelfImprovement />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {meeting.employee}
                      </Typography>
                      <Chip label={meeting.type} size="small" variant="outlined" />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {meeting.date} at {meeting.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Agenda: {meeting.agenda}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Team Development Plans
          </Typography>
          {/* Development content */}
        </TabPanel>
      </Card>

      {/* One-on-One Dialog */}
      <Dialog
        open={oneOnOneDialog}
        onClose={() => setOneOnOneDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Schedule One-on-One - {selectedEmployee?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Meeting Date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Meeting Time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Meeting Type</InputLabel>
                <Select label="Meeting Type">
                  <MenuItem value="regular">Regular Check-in</MenuItem>
                  <MenuItem value="performance">Performance Review</MenuItem>
                  <MenuItem value="career">Career Development</MenuItem>
                  <MenuItem value="feedback">Feedback Session</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Meeting Agenda"
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="What would you like to discuss in this meeting?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOneOnOneDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('Scheduling one-on-one:', selectedEmployee, meetingNotes);
              setOneOnOneDialog(false);
              setSelectedEmployee(null);
              setMeetingNotes('');
            }}
          >
            Schedule Meeting
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}