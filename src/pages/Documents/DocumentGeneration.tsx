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
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Description,
  Person,
  Send,
  Preview,
  Download,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const steps = ['Select Template', 'Choose Employee', 'Fill Details', 'Review & Generate'];

export default function DocumentGeneration() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Mock data
  const templates = [
    { id: '1', name: 'Standard Offer Letter', type: 'offer-letter', category: 'Recruitment' },
    { id: '2', name: 'Experience Certificate', type: 'experience-letter', category: 'Separation' },
    { id: '3', name: 'Relieving Letter', type: 'relieving-letter', category: 'Separation' },
    { id: '4', name: 'Salary Certificate', type: 'salary-certificate', category: 'Payroll' },
    { id: '5', name: 'Promotion Letter', type: 'promotion-letter', category: 'Employment' },
  ];

  const employees = [
    { id: '1', name: 'John Doe', employeeId: 'EMP001', department: 'Engineering', designation: 'Software Engineer' },
    { id: '2', name: 'Sarah Wilson', employeeId: 'EMP002', department: 'Sales', designation: 'Sales Manager' },
    { id: '3', name: 'Mike Johnson', employeeId: 'EMP003', department: 'Marketing', designation: 'Marketing Specialist' },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGenerate = (data: any) => {
    console.log('Generating document with data:', data);
    
    // Mock generated document
    setGeneratedDocument({
      id: 'DOC001',
      title: `${selectedTemplate.name} - ${selectedEmployee.name}`,
      documentNumber: 'OFFER2024001',
      status: 'generated',
      pdfUrl: 'https://example.com/document.pdf',
      createdAt: new Date(),
    });
    
    setActiveStep(activeStep + 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Document Template
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Choose the type of document you want to generate
              </Typography>
            </Grid>
            {templates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card
                  variant={selectedTemplate?.id === template.id ? 'elevation' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    border: selectedTemplate?.id === template.id ? 2 : 1,
                    borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Description color="primary" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {template.name}
                        </Typography>
                        <Chip
                          label={template.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Employee
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Choose the employee for whom you want to generate the document
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={selectedEmployee?.id || ''}
                  onChange={(e) => {
                    const employee = employees.find(emp => emp.id === e.target.value);
                    setSelectedEmployee(employee);
                  }}
                  label="Employee"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      <Box>
                        <Typography variant="subtitle2">
                          {employee.name} ({employee.employeeId})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.designation} • {employee.department}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedEmployee && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Employee Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Name:</strong> {selectedEmployee.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Employee ID:</strong> {selectedEmployee.employeeId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Department:</strong> {selectedEmployee.department}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Designation:</strong> {selectedEmployee.designation}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fill Template Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Provide specific information for this document
              </Typography>
            </Grid>
            
            {selectedTemplate?.type === 'offer-letter' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position Offered"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Annual Salary"
                    type="number"
                    placeholder="e.g., 100000"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reporting Manager"
                    placeholder="e.g., Jane Smith"
                  />
                </Grid>
              </>
            )}

            {selectedTemplate?.type === 'experience-letter' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Experience Duration"
                    placeholder="e.g., 2 years 3 months"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Key Responsibilities"
                    placeholder="Describe the employee's key responsibilities and achievements..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Performance Summary"
                    placeholder="Brief performance summary..."
                  />
                </Grid>
              </>
            )}

            {selectedTemplate?.type === 'salary-certificate' && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Basic Salary"
                    type="number"
                    placeholder="e.g., 60000"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Allowances"
                    type="number"
                    placeholder="e.g., 30000"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Gross Salary"
                    type="number"
                    placeholder="e.g., 90000"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Purpose"
                    placeholder="e.g., Loan application, Visa processing"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Send document via email to employee"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review & Generate Document
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please review the details below before generating the document.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Template Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText
                        primary="Template"
                        secondary={selectedTemplate?.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Type"
                        secondary={selectedTemplate?.type.replace('-', ' ')}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Category"
                        secondary={selectedTemplate?.category}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Employee Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary="Employee"
                        secondary={selectedEmployee?.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Employee ID"
                        secondary={selectedEmployee?.employeeId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Department"
                        secondary={selectedEmployee?.department}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Designation"
                        secondary={selectedEmployee?.designation}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {generatedDocument && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Document generated successfully!
                </Alert>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {generatedDocument.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Document Number: {generatedDocument.documentNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Generated on {new Date(generatedDocument.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Preview />}
                          size="small"
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          size="small"
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Generate Document
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create documents from templates for employees
      </Typography>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 2 ? (
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={() => handleGenerate({})}
                        disabled={!selectedTemplate || !selectedEmployee}
                      >
                        Generate Document
                      </Button>
                    ) : activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setActiveStep(0);
                          setSelectedTemplate(null);
                          setSelectedEmployee(null);
                          setGeneratedDocument(null);
                        }}
                      >
                        Generate Another
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                          (activeStep === 0 && !selectedTemplate) ||
                          (activeStep === 1 && !selectedEmployee)
                        }
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </Box>
  );
}