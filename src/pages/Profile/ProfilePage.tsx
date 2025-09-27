import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Tabs,
  Tab,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Security,
  Description,
  Person,
  ContactPhone,
  Business,
  AccountBalance,
} from '@mui/icons-material';
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

export default function ProfilePage() {
  const { user, employee } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your personal information and account settings
      </Typography>

      {/* Profile Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120,
                fontSize: '3rem',
                bgcolor: 'primary.main'
              }}
              src={employee?.personalDetails?.photoUrl}
            >
              {user?.firstName?.charAt(0)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight={600}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {employee?.companyDetails?.designation}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {employee?.companyDetails?.department} • Employee ID: {employee?.employeeId}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip
                  label={employee?.status || 'Active'}
                  color="success"
                  size="small"
                />
                <Chip
                  label={user?.role?.replace('-', ' ').toUpperCase()}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Personal Information" />
            <Tab label="Company Details" />
            <Tab label="Contact Information" />
            <Tab label="Bank Details" />
            <Tab label="Documents" />
            <Tab label="Security" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={user?.firstName || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={user?.lastName || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={employee?.personalDetails?.dateOfBirth ? 
                  new Date(employee.personalDetails.dateOfBirth).toISOString().split('T')[0] : ''}
                disabled={!editMode}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gender"
                value={employee?.personalDetails?.gender || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marital Status"
                value={employee?.personalDetails?.maritalStatus || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nationality"
                value={employee?.personalDetails?.nationality || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Company Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={employee?.employeeId || ''}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={employee?.companyDetails?.department || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Designation"
                value={employee?.companyDetails?.designation || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                value={employee?.companyDetails?.joiningDate ? 
                  new Date(employee.companyDetails.joiningDate).toISOString().split('T')[0] : ''}
                disabled
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employment Type"
                value={employee?.companyDetails?.employmentType || ''}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Work Location"
                value={employee?.companyDetails?.workLocation || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contact Information Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                value={employee?.contactDetails?.email || user?.email || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={employee?.contactDetails?.phone || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Current Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={employee?.contactDetails?.address?.street || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={employee?.contactDetails?.address?.city || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={employee?.contactDetails?.address?.state || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={employee?.contactDetails?.address?.postalCode || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Bank Details Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                value={employee?.bankDetails?.accountNumber || ''}
                disabled={!editMode}
                margin="normal"
                type="password"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={employee?.bankDetails?.bankName || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch Name"
                value={employee?.bankDetails?.branchName || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                value={employee?.bankDetails?.ifscCode || ''}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={4}>
          <List>
            {employee?.documents?.map((doc, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={doc.fileName}
                  secondary={`${doc.type} • Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                />
                <Chip
                  label={doc.verified ? 'Verified' : 'Pending'}
                  color={doc.verified ? 'success' : 'warning'}
                  size="small"
                />
              </ListItem>
            )) || (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No documents uploaded yet
              </Typography>
            )}
          </List>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Security color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.mfaEnabled ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Box>
                    <Button
                      variant={user?.mfaEnabled ? 'outlined' : 'contained'}
                      size="small"
                    >
                      {user?.mfaEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Security color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last changed: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Change
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
}