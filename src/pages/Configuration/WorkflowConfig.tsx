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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AccountTree,
  Person,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import PermissionGuard from '../../components/Auth/PermissionGuard';

export default function WorkflowConfig() {
  const [workflowDialog, setWorkflowDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: 'steps',
  });

  // Mock workflow data
  const workflows = [
    {
      id: '1',
      name: 'Leave Approval Workflow',
      type: 'leave',
      description: 'Multi-level approval process for leave requests',
      isActive: true,
      steps: [
        { level: 1, role: 'manager', sla: 24, escalation: true },
        { level: 2, role: 'hr', sla: 48, escalation: false },
      ],
      usageCount: 1247,
    },
    {
      id: '2',
      name: 'Expense Claim Workflow',
      type: 'expense',
      description: 'Approval workflow for expense claims',
      isActive: true,
      steps: [
        { level: 1, role: 'manager', sla: 24, escalation: true },
        { level: 2, role: 'finance', sla: 72, escalation: false },
      ],
      usageCount: 892,
    },
    {
      id: '3',
      name: 'Performance Review Workflow',
      type: 'performance',
      description: 'Performance review and calibration process',
      isActive: true,
      steps: [
        { level: 1, role: 'employee', sla: 168, escalation: false },
        { level: 2, role: 'manager', sla: 168, escalation: true },
        { level: 3, role: 'hr', sla: 72, escalation: false },
      ],
      usageCount: 156,
    },
  ];

  const onSubmit = (data: any) => {
    console.log('Workflow data:', data);
    setWorkflowDialog(false);
    reset();
  };

  const addStep = () => {
    appendStep({
      level: stepFields.length + 1,
      role: '',
      sla: 24,
      escalation: false,
    });
  };

  return (
    <PermissionGuard module="configuration" action="read" showError>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Workflow Configuration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure approval workflows and business processes
            </Typography>
          </Box>
          
          <PermissionGuard module="configuration" action="create">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedWorkflow(null);
                reset();
                setWorkflowDialog(true);
              }}
            >
              Create Workflow
            </Button>
          </PermissionGuard>
        </Box>

        {/* Workflow Cards */}
        <Grid container spacing={3}>
          {workflows.map((workflow) => (
            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {workflow.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {workflow.description}
                      </Typography>
                      <Chip
                        label={workflow.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Chip
                      label={workflow.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={workflow.isActive ? 'success' : 'default'}
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Approval Steps ({workflow.steps.length})
                  </Typography>
                  <Stepper orientation="vertical" sx={{ mb: 2 }}>
                    {workflow.steps.map((step, index) => (
                      <Step key={index} active completed={false}>
                        <StepLabel>
                          <Typography variant="body2">
                            {step.role.toUpperCase()} ({step.sla}h SLA)
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Used {workflow.usageCount} times
                    </Typography>
                    <PermissionGuard module="configuration" action="update">
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            reset(workflow);
                            setWorkflowDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </PermissionGuard>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Workflow Dialog */}
        <Dialog
          open={workflowDialog}
          onClose={() => setWorkflowDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Workflow name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Workflow Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Workflow type is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.type}>
                        <InputLabel>Workflow Type</InputLabel>
                        <Select {...field} label="Workflow Type">
                          <MenuItem value="leave">Leave Approval</MenuItem>
                          <MenuItem value="expense">Expense Claim</MenuItem>
                          <MenuItem value="performance">Performance Review</MenuItem>
                          <MenuItem value="recruitment">Recruitment</MenuItem>
                          <MenuItem value="asset">Asset Assignment</MenuItem>
                          <MenuItem value="document">Document Approval</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Approval Steps
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={addStep}
                    >
                      Add Step
                    </Button>
                  </Box>

                  {stepFields.map((field, index) => (
                    <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Level"
                              type="number"
                              defaultValue={index + 1}
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Role</InputLabel>
                              <Select label="Role">
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="hr">HR</MenuItem>
                                <MenuItem value="finance">Finance</MenuItem>
                                <MenuItem value="tenant-admin">Admin</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="SLA (hours)"
                              type="number"
                              defaultValue={24}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <FormControlLabel
                              control={<Switch size="small" />}
                              label="Escalation"
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <IconButton
                              color="error"
                              onClick={() => removeStep(index)}
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWorkflowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              {selectedWorkflow ? 'Update Workflow' : 'Create Workflow'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  );
}