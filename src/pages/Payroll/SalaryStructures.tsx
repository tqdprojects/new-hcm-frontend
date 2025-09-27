import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  AttachMoney,
  TrendingUp,
  Remove,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

interface SalaryComponent {
  name: string;
  type: 'earning' | 'deduction';
  amount: number;
  isPercentage: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
}

interface SalaryStructureForm {
  name: string;
  description: string;
  basicSalary: number;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
  currency: string;
  applicableRoles: string[];
}

export default function SalaryStructures() {
  const [createDialog, setCreateDialog] = useState(false);
  const [editingStructure, setEditingStructure] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SalaryStructureForm>({
    defaultValues: {
      name: '',
      description: '',
      basicSalary: 0,
      allowances: [],
      deductions: [],
      currency: 'USD',
      applicableRoles: ['employee'],
    },
  });

  const {
    fields: allowanceFields,
    append: appendAllowance,
    remove: removeAllowance,
  } = useFieldArray({
    control,
    name: 'allowances',
  });

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: 'deductions',
  });

  const salaryStructures = [
    {
      id: '1',
      name: 'Software Engineer L1',
      description: 'Entry level software engineer',
      basicSalary: 60000,
      totalEarnings: 93850,
      totalDeductions: 800,
      netSalary: 93050,
      currency: 'USD',
      applicableRoles: ['employee'],
      isActive: true,
      employeeCount: 45,
    },
    {
      id: '2',
      name: 'Software Engineer L2',
      description: 'Mid-level software engineer',
      basicSalary: 80000,
      totalEarnings: 122850,
      totalDeductions: 1000,
      netSalary: 121850,
      currency: 'USD',
      applicableRoles: ['employee'],
      isActive: true,
      employeeCount: 78,
    },
    {
      id: '3',
      name: 'Manager Level',
      description: 'Management level compensation',
      basicSalary: 120000,
      totalEarnings: 192400,
      totalDeductions: 1400,
      netSalary: 191000,
      currency: 'USD',
      applicableRoles: ['manager'],
      isActive: true,
      employeeCount: 25,
    },
  ];

  const onSubmit = (data: SalaryStructureForm) => {
    console.log('Creating salary structure:', data);
    setCreateDialog(false);
    reset();
  };

  const handleEdit = (structure: any) => {
    setEditingStructure(structure);
    reset(structure);
    setCreateDialog(true);
  };

  const addAllowance = () => {
    appendAllowance({
      name: '',
      type: 'earning',
      amount: 0,
      isPercentage: false,
      isTaxable: true,
      isStatutory: false,
    });
  };

  const addDeduction = () => {
    appendDeduction({
      name: '',
      type: 'deduction',
      amount: 0,
      isPercentage: false,
      isTaxable: false,
      isStatutory: false,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Salary Structures
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage compensation templates and salary components
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          Create Structure
        </Button>
      </Box>

      {/* Salary Structures List */}
      <Grid container spacing={3}>
        {salaryStructures.map((structure) => (
          <Grid item xs={12} key={structure.id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {structure.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {structure.description} • {structure.employeeCount} employees
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', mr: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="success.main">
                      ${structure.netSalary.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Salary
                    </Typography>
                  </Box>
                  <Chip
                    label={structure.isActive ? 'Active' : 'Inactive'}
                    color={structure.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Basic Salary
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="primary.main">
                          ${structure.basicSalary.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Total Earnings
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="success.main">
                          ${structure.totalEarnings.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Total Deductions
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="error.main">
                          ${structure.totalDeductions.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(structure)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
          setEditingStructure(null);
          reset();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingStructure ? 'Edit' : 'Create'} Salary Structure
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Structure Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="basicSalary"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Basic Salary"
                      type="number"
                      error={!!errors.basicSalary}
                      helperText={errors.basicSalary?.message}
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
                      rows={2}
                      label="Description"
                    />
                  )}
                />
              </Grid>

              {/* Allowances */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Allowances
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={addAllowance}
                  >
                    Add Allowance
                  </Button>
                </Box>
                {allowanceFields.map((field, index) => (
                  <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`allowances.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Component Name"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Controller
                            name={`allowances.${index}.amount`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Amount"
                                type="number"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Controller
                            name={`allowances.${index}.isPercentage`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                  value={field.value ? 'percentage' : 'fixed'}
                                  onChange={(e) => field.onChange(e.target.value === 'percentage')}
                                  label="Type"
                                >
                                  <MenuItem value="fixed">Fixed</MenuItem>
                                  <MenuItem value="percentage">Percentage</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip label="Taxable" size="small" color="info" />
                            <Chip label="Non-Statutory" size="small" variant="outlined" />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <IconButton
                            color="error"
                            onClick={() => removeAllowance(index)}
                          >
                            <Remove />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              {/* Deductions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Deductions
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={addDeduction}
                  >
                    Add Deduction
                  </Button>
                </Box>
                {deductionFields.map((field, index) => (
                  <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`deductions.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Component Name"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Controller
                            name={`deductions.${index}.amount`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Amount"
                                type="number"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Controller
                            name={`deductions.${index}.isPercentage`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                  value={field.value ? 'percentage' : 'fixed'}
                                  onChange={(e) => field.onChange(e.target.value === 'percentage')}
                                  label="Type"
                                >
                                  <MenuItem value="fixed">Fixed</MenuItem>
                                  <MenuItem value="percentage">Percentage</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip label="Statutory" size="small" color="warning" />
                            <Chip label="Non-Taxable" size="small" variant="outlined" />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <IconButton
                            color="error"
                            onClick={() => removeDeduction(index)}
                          >
                            <Remove />
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
          <Button onClick={() => {
            setCreateDialog(false);
            setEditingStructure(null);
            reset();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            {editingStructure ? 'Update' : 'Create'} Structure
          </Button>
        </DialogActions>
      </Dialog>

      {/* Structures Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Structure Name</TableCell>
                  <TableCell align="right">Basic Salary</TableCell>
                  <TableCell align="right">Total Earnings</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                  <TableCell align="center">Employees</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryStructures.map((structure) => (
                  <TableRow key={structure.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {structure.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {structure.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${structure.basicSalary.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${structure.totalEarnings.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600} color="success.main">
                        ${structure.netSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={structure.employeeCount}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={structure.isActive ? 'Active' : 'Inactive'}
                        color={structure.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(structure)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}