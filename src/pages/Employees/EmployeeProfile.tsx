import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Person,
  AccountBalance,
  Description,
  ArrowBack,
} from '@mui/icons-material';
import { useEmployee } from '../../hooks/useEmployees';
import { useAuthStore } from '../../stores/authStore';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

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

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);

  const { data: employeeResponse, isLoading, error } = useEmployee(id!);
  const employee = employeeResponse?.data;

  const canEdit = ['hr', 'tenant-admin'].includes(user?.role || '') || 
                  (user?.role === 'employee' && employee?.userId?.toString() === user?._id?.toString());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading employee profile..." />;
  }

  if (error || !employee) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load employee profile. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/employees')}
          sx={{ mr: 2 }}
        >
          Back to Employees
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Employee Profile
        </Typography>
      </Box>

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
              src={employee.personalDetails?.photoUrl}
            >
              {employee.personalDetails?.firstName?.charAt(0)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight={600}>
                {employee.personalDetails?.firstName} {employee.personalDetails?.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {employee.companyDetails?.designation}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {employee.companyDetails?.department} • Employee ID: {employee.employeeId}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip
                  label={employee.status}
                  color={employee.status === 'active' ? 'success' : 'default'}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip
                  label={employee.companyDetails?.employmentType}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip
                  label={employee.onboardingStatus}
                  color={employee.onboardingStatus === 'completed' ? 'success' : 'warning'}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </Box>
            
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate(`/employees/${id}/edit`)}
              >
                Edit Profile
              </Button>
            )}
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
            <Tab label="Emergency Contacts" />
            <Tab label="Documents" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={`${employee.personalDetails?.firstName} ${employee.personalDetails?.middleName || ''} ${employee.personalDetails?.lastName}`.trim()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={employee.personalDetails?.dateOfBirth ? 
                      new Date(employee.personalDetails.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={employee.personalDetails?.gender || 'Not provided'}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Marital Status"
                    secondary={employee.personalDetails?.maritalStatus || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nationality"
                    secondary={employee.personalDetails?.nationality || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Blood Group"
                    secondary={employee.personalDetails?.bloodGroup || 'Not provided'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Company Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employee ID"
                    secondary={employee.employeeId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={employee.companyDetails?.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText
                    primary="Designation"
                    secondary={employee.companyDetails?.designation}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Joining Date"
                    secondary={employee.companyDetails?.joiningDate ? 
                      new Date(employee.companyDetails.joiningDate).toLocaleDateString() : 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employment Type"
                    secondary={employee.companyDetails?.employmentType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Work Location"
                    secondary={employee.companyDetails?.workLocation}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contact Information Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Address"
                    secondary={employee.contactDetails?.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={employee.contactDetails?.phone}
                  />
                </ListItem>
                {employee.contactDetails?.alternatePhone && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Alternate Phone"
                      secondary={employee.contactDetails.alternatePhone}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Current Address
              </Typography>
              {employee.contactDetails?.address && (
                <Typography variant="body2" color="text.secondary">
                  {employee.contactDetails.address.street}<br />
                  {employee.contactDetails.address.city}, {employee.contactDetails.address.state}<br />
                  {employee.contactDetails.address.country} - {employee.contactDetails.address.postalCode}
                </Typography>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Bank Details Tab */}
        <TabPanel value={tabValue} index={3}>
          {employee.bankDetails ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Number"
                      secondary={employee.bankDetails.accountNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="Bank Name"
                      secondary={employee.bankDetails.bankName || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="Branch Name"
                      secondary={employee.bankDetails.branchName || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="IFSC Code"
                      secondary={employee.bankDetails.ifscCode || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">
              No bank details provided yet.
            </Alert>
          )}
        </TabPanel>

        {/* Emergency Contacts Tab */}
        <TabPanel value={tabValue} index={4}>
          {employee.emergencyContacts && employee.emergencyContacts.length > 0 ? (
            <Grid container spacing={3}>
              {employee.emergencyContacts.map((contact, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {contact.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {contact.relationship}
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>
                          <ListItemText primary={contact.phone} />
                        </ListItem>
                        {contact.email && (
                          <ListItem>
                            <ListItemIcon>
                              <Email />
                            </ListItemIcon>
                            <ListItemText primary={contact.email} />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No emergency contacts provided yet.
            </Alert>
          )}
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={5}>
          {employee.documents && employee.documents.length > 0 ? (
            <List>
              {employee.documents.map((doc, index) => (
                <React.Fragment key={index}>
                  <ListItem>
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
                  {index < employee.documents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No documents uploaded yet.
            </Alert>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
}