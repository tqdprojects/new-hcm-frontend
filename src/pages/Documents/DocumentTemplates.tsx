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
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  Download,
  Send,
  ExpandMore,
  Code,
  Preview,
  Settings,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePermissions } from '../../components/Auth/PermissionGuard';
import PermissionGuard from '../../components/Auth/PermissionGuard';

const templateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  type: z.enum([
    'offer-letter',
    'relieving-letter', 
    'experience-letter',
    'appointment-letter',
    'confirmation-letter',
    'salary-certificate',
    'noc-letter',
    'promotion-letter',
    'warning-letter',
    'termination-letter',
    'transfer-letter',
    'payslip-template',
    'custom'
  ]),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  isDefault: z.boolean().default(false),
  approvalRequired: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type TemplateForm = z.infer<typeof templateSchema>;

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

export default function DocumentTemplates() {
  const { hasPermission, isHR, isAdmin } = usePermissions();
  const [templateDialog, setTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      isDefault: false,
      approvalRequired: false,
      tags: [],
    },
  });

  const {
    fields: variableFields,
    append: appendVariable,
    remove: removeVariable,
  } = useFieldArray({
    control,
    name: 'variables' as any,
  });

  // Mock data for demonstration
  const templates = [
    {
      id: '1',
      name: 'Standard Offer Letter',
      description: 'Default offer letter template for all positions',
      type: 'offer-letter',
      category: 'Recruitment',
      status: 'active',
      isDefault: true,
      usageCount: 45,
      lastUsedAt: '2024-12-01',
      createdBy: 'HR Admin',
      version: 2,
    },
    {
      id: '2',
      name: 'Experience Certificate',
      description: 'Standard experience letter template',
      type: 'experience-letter',
      category: 'Separation',
      status: 'active',
      isDefault: true,
      usageCount: 23,
      lastUsedAt: '2024-11-28',
      createdBy: 'HR Manager',
      version: 1,
    },
    {
      id: '3',
      name: 'Relieving Letter',
      description: 'Standard relieving letter for departing employees',
      type: 'relieving-letter',
      category: 'Separation',
      status: 'active',
      isDefault: true,
      usageCount: 18,
      lastUsedAt: '2024-11-25',
      createdBy: 'HR Admin',
      version: 1,
    },
  ];

  const templateTypes = [
    { value: 'offer-letter', label: 'Offer Letter', category: 'Recruitment' },
    { value: 'appointment-letter', label: 'Appointment Letter', category: 'Recruitment' },
    { value: 'confirmation-letter', label: 'Confirmation Letter', category: 'Employment' },
    { value: 'promotion-letter', label: 'Promotion Letter', category: 'Employment' },
    { value: 'transfer-letter', label: 'Transfer Letter', category: 'Employment' },
    { value: 'experience-letter', label: 'Experience Letter', category: 'Separation' },
    { value: 'relieving-letter', label: 'Relieving Letter', category: 'Separation' },
    { value: 'noc-letter', label: 'NOC Letter', category: 'Separation' },
    { value: 'salary-certificate', label: 'Salary Certificate', category: 'Payroll' },
    { value: 'warning-letter', label: 'Warning Letter', category: 'Disciplinary' },
    { value: 'termination-letter', label: 'Termination Letter', category: 'Disciplinary' },
    { value: 'custom', label: 'Custom Template', category: 'Custom' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: TemplateForm) => {
    console.log('Template data:', data);
    setTemplateDialog(false);
    setEditingTemplate(null);
    reset();
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    reset(template);
    setTemplateDialog(true);
  };

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'inactive': return 'default';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  const defaultTemplateContent = `Dear {{employee.firstName}},

This is a template letter for {{employee.fullName}} (Employee ID: {{employee.employeeId}}).

Company: {{company.name}}
Department: {{employee.department}}
Designation: {{employee.designation}}
Date: {{system.currentDate}}

Best regards,
{{company.name}}
HR Department`;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Document Templates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage document templates for your organization
          </Typography>
        </Box>
        
        <PermissionGuard module="documents" action="create">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingTemplate(null);
              reset({
                content: defaultTemplateContent,
                isDefault: false,
                approvalRequired: false,
                tags: [],
              });
              setTemplateDialog(true);
            }}
          >
            Create Template
          </Button>
        </PermissionGuard>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Template Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Template Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {templateTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setTypeFilter('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Template Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Usage</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {template.name}
                          {template.isDefault && (
                            <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.type.replace('-', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{template.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={template.status}
                        size="small"
                        color={getStatusColor(template.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {template.usageCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {template.lastUsedAt ? new Date(template.lastUsedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>v{template.version}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Clone">
                          <IconButton size="small">
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={templateDialog}
        onClose={() => {
          setTemplateDialog(false);
          setEditingTemplate(null);
          reset();
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Basic Information" />
              <Tab label="Content" />
              <Tab label="Variables" />
              <Tab label="Settings" />
            </Tabs>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Template Name"
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
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.type}>
                        <InputLabel>Template Type</InputLabel>
                        <Select {...field} label="Template Type">
                          {templateTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="Recruitment">Recruitment</MenuItem>
                          <MenuItem value="Employment">Employment</MenuItem>
                          <MenuItem value="Separation">Separation</MenuItem>
                          <MenuItem value="Payroll">Payroll</MenuItem>
                          <MenuItem value="Disciplinary">Disciplinary</MenuItem>
                          <MenuItem value="Custom">Custom</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="isDefault"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Set as Default Template"
                      />
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
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Use variables like {`{{employee.firstName}}`}, {`{{company.name}}`}, {`{{system.currentDate}}`} in your template content.
                    These will be automatically replaced when generating documents.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={20}
                        label="Template Content"
                        error={!!errors.content}
                        helperText={errors.content?.message}
                        placeholder="Enter your template content here..."
                        sx={{
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Available Variables
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  These variables will be automatically populated when generating documents
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Employee Variables
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {[
                      'employee.firstName',
                      'employee.lastName', 
                      'employee.fullName',
                      'employee.employeeId',
                      'employee.email',
                      'employee.department',
                      'employee.designation',
                      'employee.joiningDate'
                    ].map((variable) => (
                      <Chip
                        key={variable}
                        label={`{{${variable}}}`}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          // Copy to clipboard functionality
                          navigator.clipboard.writeText(`{{${variable}}}`);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Variables
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {[
                      'company.name',
                      'company.address',
                      'company.email',
                      'company.phone'
                    ].map((variable) => (
                      <Chip
                        key={variable}
                        label={`{{${variable}}}`}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          navigator.clipboard.writeText(`{{${variable}}}`);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    System Variables
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {[
                      'system.currentDate',
                      'system.currentYear',
                      'system.documentNumber'
                    ].map((variable) => (
                      <Chip
                        key={variable}
                        label={`{{${variable}}}`}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          navigator.clipboard.writeText(`{{${variable}}}`);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="approvalRequired"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Require Approval Before Generation"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter tags separated by commas"
                    helperText="Tags help organize and search templates"
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTemplateDialog(false);
            setEditingTemplate(null);
            reset();
          }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => {
              // Preview functionality
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview - {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1, fontFamily: 'monospace' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {selectedTemplate?.content || 'No content available'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Send />}>
            Generate Document
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}