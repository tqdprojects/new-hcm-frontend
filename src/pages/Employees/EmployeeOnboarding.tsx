import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEmployee, useUpdateEmployee, useEmployee, useOnboardingSteps, useUpdateOnboardingStep } from '../../hooks/useEmployees';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmployeeSalarySetup from './EmployeeSalarySetup';

const personalDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  nationality: z.string().min(1, 'Nationality is required'),
  bloodGroup: z.string().optional(),
});

const companyDetailsSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  workLocation: z.string().min(1, 'Work location is required'),
});

const contactDetailsSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  alternatePhone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});

const bankDetailsSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  accountType: z.string().min(1, 'Account type is required'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
});

const steps = [
  'Personal Information',
  'Company Details',
  'Contact Information',
  'Bank Details',
  'Emergency Contacts',
  'Salary Configuration',
  'Document Upload',
  'Review & Complete'
];

export default function EmployeeOnboarding() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [employeeData, setEmployeeData] = useState<any>({});

  const isEdit = !!id;
  const { data: employeeResponse } = useEmployee(id || '');
  const { data: onboardingResponse } = useOnboardingSteps(id || '');
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const updateOnboardingMutation = useUpdateOnboardingStep();

  const employee = employeeResponse?.data;
  const onboardingData = onboardingResponse?.data;

  useEffect(() => {
    if (employee && isEdit) {
      setEmployeeData(employee);
      // Set active step based on onboarding status
      if (onboardingData?.steps) {
        const completedSteps = onboardingData.steps.filter((step: any) => step.completed).length;
        setActiveStep(Math.min(completedSteps, steps.length - 1));
      }
    }
  }, [employee, onboardingData, isEdit]);

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 0: return personalDetailsSchema;
      case 1: return companyDetailsSchema;
      case 2: return contactDetailsSchema;
      case 3: return bankDetailsSchema;
      case 4: return emergencyContactSchema;
      default: return z.object({});
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(getSchemaForStep(activeStep)),
    defaultValues: getDefaultValues(activeStep, employeeData)
  });

  function getDefaultValues(step: number, data: any) {
    switch (step) {
      case 0:
        return data.personalDetails || {};
      case 1:
        return data.companyDetails || {};
      case 2:
        return data.contactDetails || {};
      case 3:
        return data.bankDetails || {};
      case 4:
        return {};
      default:
        return {};
    }
  }

  const handleNext = async (data: any) => {
    const updatedEmployeeData = { ...employeeData };
    
    switch (activeStep) {
      case 0:
        updatedEmployeeData.personalDetails = data;
        break;
      case 1:
        updatedEmployeeData.companyDetails = data;
        break;
      case 2:
        updatedEmployeeData.contactDetails = data;
        break;
      case 3:
        updatedEmployeeData.bankDetails = data;
        break;
      case 4:
        if (!updatedEmployeeData.emergencyContacts) {
          updatedEmployeeData.emergencyContacts = [];
        }
        updatedEmployeeData.emergencyContacts.push(data);
        break;
    }

    setEmployeeData(updatedEmployeeData);

    if (isEdit) {
      // Update onboarding step
      await updateOnboardingMutation.mutateAsync({
        id: id!,
        step: activeStep + 1,
        data
      });
    }

    if (activeStep === steps.length - 1) {
      // Final step - create or update employee
      if (isEdit) {
        await updateEmployeeMutation.mutateAsync({
          id: id!,
          data: updatedEmployeeData
        });
      } else {
        await createEmployeeMutation.mutateAsync(updatedEmployeeData);
      }
      navigate('/employees');
    } else {
      setActiveStep(activeStep + 1);
      reset(getDefaultValues(activeStep + 1, updatedEmployeeData));
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    reset(getDefaultValues(activeStep - 1, employeeData));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Middle Name (Optional)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.maritalStatus}>
                    <InputLabel>Marital Status</InputLabel>
                    <Select {...field} label="Marital Status">
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                      <MenuItem value="divorced">Divorced</MenuItem>
                      <MenuItem value="widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nationality"
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Blood Group (Optional)"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.department}>
                    <InputLabel>Department</InputLabel>
                    <Select {...field} label="Department">
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="Human Resources">Human Resources</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Operations">Operations</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Designation"
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Joining Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.joiningDate}
                    helperText={errors.joiningDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.employmentType}>
                    <InputLabel>Employment Type</InputLabel>
                    <Select {...field} label="Employment Type">
                      <MenuItem value="full-time">Full Time</MenuItem>
                      <MenuItem value="part-time">Part Time</MenuItem>
                      <MenuItem value="contract">Contract</MenuItem>
                      <MenuItem value="internship">Internship</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="workLocation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Work Location"
                    error={!!errors.workLocation}
                    helperText={errors.workLocation?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="alternatePhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Alternate Phone (Optional)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Current Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Street Address"
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="City"
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="State"
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="address.postalCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Postal Code"
                    error={!!errors.address?.postalCode}
                    helperText={errors.address?.postalCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Country"
                    error={!!errors.address?.country}
                    helperText={errors.address?.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Account Number"
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bank Name"
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="branchName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Branch Name"
                    error={!!errors.branchName}
                    helperText={errors.branchName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="ifscCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="IFSC Code"
                    error={!!errors.ifscCode}
                    helperText={errors.ifscCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="accountType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.accountType}>
                    <InputLabel>Account Type</InputLabel>
                    <Select {...field} label="Account Type">
                      <MenuItem value="savings">Savings</MenuItem>
                      <MenuItem value="current">Current</MenuItem>
                      <MenuItem value="salary">Salary</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Add at least one emergency contact. You can add more contacts later.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="relationship"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.relationship}>
                    <InputLabel>Relationship</InputLabel>
                    <Select {...field} label="Relationship">
                      <MenuItem value="spouse">Spouse</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="sibling">Sibling</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="friend">Friend</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email (Optional)"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 5:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Salary configuration will be set up after employee creation. HR can configure salary details from the employee profile.
            </Alert>
            <Typography variant="body1">
              The following will be configured after employee creation:
            </Typography>
            <ul>
              <li>Salary structure assignment</li>
              <li>Custom salary components</li>
              <li>Compensation details</li>
              <li>Payroll settings</li>
            </ul>
          </Box>
        );

      case 6:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Document upload functionality will be implemented here. For now, you can skip this step.
            </Alert>
            <Typography variant="body1">
              Required documents:
            </Typography>
            <ul>
              <li>Resume/CV</li>
              <li>Identity Proof (Passport/Driver's License)</li>
              <li>Address Proof</li>
              <li>Educational Certificates</li>
              <li>Previous Employment Letters</li>
            </ul>
          </Box>
        );

      case 7:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Please review all the information you've provided. Once you complete the onboarding, 
              your profile will be created and you'll receive login credentials.
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Personal Details
                </Typography>
                <Typography variant="body2">
                  {employeeData.personalDetails?.firstName} {employeeData.personalDetails?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {employeeData.personalDetails?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Company Details
                </Typography>
                <Typography variant="body2">
                  {employeeData.companyDetails?.designation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {employeeData.companyDetails?.department}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Salary Details
                </Typography>
                <Typography variant="body2">
                  ${employeeData.salary?.grossSalary?.toLocaleString() || 'Not set'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {employeeData.salary?.currency || 'USD'} Annual
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  if (isEdit && !employee) {
    return <LoadingSpinner message="Loading employee data..." />;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {isEdit ? 'Employee Onboarding' : 'Add New Employee'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isEdit ? 'Complete the onboarding process' : 'Create a new employee profile'}
      </Typography>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {onboardingData && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Overall Progress: {onboardingData.overallProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={onboardingData.overallProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          <form onSubmit={handleSubmit(handleNext)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending || updateOnboardingMutation.isPending}
              >
                {activeStep === steps.length - 1 ? 'Complete Onboarding' : 'Next'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}