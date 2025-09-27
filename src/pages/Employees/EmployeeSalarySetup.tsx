import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Delete,
  Calculate,
  Save,
  Preview,
  AttachMoney,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useSalaryStructures, 
  useSalaryComponents, 
  useEmployeeSalary, 
  useSetEmployeeSalary,
  usePreviewPayroll 
} from '../../hooks/usePayroll';

const salarySetupSchema = z.object({
  salaryStructureId: z.string().optional(),
  useCustomStructure: z.boolean(),
  grossSalary: z.number().min(1, 'Gross salary must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  customComponents: z.array(z.object({
    componentId: z.string(),
    value: z.number().min(0),
    isOverridden: z.boolean(),
  })).optional(),
});

type SalarySetupForm = z.infer<typeof salarySetupSchema>;

interface EmployeeSalarySetupProps {
  employeeId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function EmployeeSalarySetup({ 
  employeeId, 
  onSave, 
  onCancel 
}: EmployeeSalarySetupProps) {
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const { data: structuresResponse } = useSalaryStructures({ isActive: true });
  const { data: componentsResponse } = useSalaryComponents({ isActive: true });
  const { data: currentSalaryResponse } = useEmployeeSalary(employeeId);
  const setEmployeeSalary = useSetEmployeeSalary();
  const previewPayroll = usePreviewPayroll();

  const structures = structuresResponse?.data?.data || [];
  const components = componentsResponse?.data?.data || [];
  const currentSalary = currentSalaryResponse?.data;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SalarySetupForm>({
    resolver: zodResolver(salarySetupSchema),
    defaultValues: {
      useCustomStructure: false,
      currency: 'USD',
      effectiveDate: new Date().toISOString().split('T')[0],
      customComponents: [],
    },
  });

  const {
    fields: componentFields,
    append: appendComponent,
    remove: removeComponent,
    update: updateComponent,
  } = useFieldArray({
    control,
    name: 'customComponents',
  });

  const watchedUseCustom = watch('useCustomStructure');
  const watchedStructureId = watch('salaryStructureId');
  const watchedGrossSalary = watch('grossSalary');

  // Load current salary data
  useEffect(() => {
    if (currentSalary) {
      reset({
        salaryStructureId: currentSalary.salaryStructureId,
        useCustomStructure: !currentSalary.salaryStructureId,
        grossSalary: currentSalary.grossSalary,
        currency: currentSalary.currency,
        effectiveDate: new Date(currentSalary.effectiveDate).toISOString().split('T')[0],
        customComponents: currentSalary.customComponents || [],
      });
    }
  }, [currentSalary, reset]);

  // Auto-populate components when structure is selected
  useEffect(() => {
    if (watchedStructureId && !watchedUseCustom) {
      const selectedStructure = structures.find(s => s._id === watchedStructureId);
      if (selectedStructure) {
        setValue('grossSalary', selectedStructure.totalEarnings);
        const structureComponents = selectedStructure.components.map(comp => ({
          componentId: comp.componentId,
          value: comp.value,
          isOverridden: false,
        }));
        setValue('customComponents', structureComponents);
      }
    }
  }, [watchedStructureId, watchedUseCustom, structures, setValue]);

  const addCustomComponent = () => {
    appendComponent({
      componentId: '',
      value: 0,
      isOverridden: false,
    });
  };

  const calculateTotals = () => {
    const earnings = componentFields
      .filter(field => {
        const component = components.find(c => c._id === field.componentId);
        return component?.type === 'earning';
      })
      .reduce((sum, field) => sum + (field.value || 0), 0);

    const deductions = componentFields
      .filter(field => {
        const component = components.find(c => c._id === field.componentId);
        return component?.type === 'deduction';
      })
      .reduce((sum, field) => sum + (field.value || 0), 0);

    return { earnings, deductions, net: earnings - deductions };
  };

  const handlePreview = async () => {
    try {
      const formData = watch();
      const result = await previewPayroll.mutateAsync({
        structureId: formData.salaryStructureId || 'custom',
        overrides: {
          grossSalary: formData.grossSalary,
          customComponents: formData.customComponents,
        }
      });
      setPreviewData(result.data);
      setPreviewDialog(true);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const onSubmit = async (data: SalarySetupForm) => {
    try {
      await setEmployeeSalary.mutateAsync({
        employeeId,
        data: {
          salaryStructureId: data.useCustomStructure ? undefined : data.salaryStructureId,
          customComponents: data.customComponents,
          grossSalary: data.grossSalary,
          currency: data.currency,
          effectiveDate: data.effectiveDate,
        }
      });
      onSave?.();
    } catch (error) {
      console.error('Salary setup failed:', error);
    }
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Salary Configuration
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Setup */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Salary Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="useCustomStructure"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label="Use Custom Salary Structure"
                        />
                      )}
                    />
                  </Grid>

                  {!watchedUseCustom && (
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="salaryStructureId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Salary Structure Template</InputLabel>
                            <Select {...field} label="Salary Structure Template">
                              {structures.map((structure) => (
                                <MenuItem key={structure._id} value={structure._id}>
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      {structure.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {structure.department} • ${structure.totalEarnings?.toLocaleString()}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="grossSalary"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Annual Gross Salary"
                          error={!!errors.grossSalary}
                          helperText={errors.grossSalary?.message}
                          InputProps={{
                            startAdornment: '$',
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Currency</InputLabel>
                          <Select {...field} label="Currency">
                            <MenuItem value="USD">USD - US Dollar</MenuItem>
                            <MenuItem value="EUR">EUR - Euro</MenuItem>
                            <MenuItem value="GBP">GBP - British Pound</MenuItem>
                            <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="effectiveDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="date"
                          label="Effective Date"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.effectiveDate}
                          helperText={errors.effectiveDate?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Salary Components */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Salary Components
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={addCustomComponent}
                  >
                    Add Component
                  </Button>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Taxable</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {componentFields.map((field, index) => {
                        const component = components.find(c => c._id === field.componentId);
                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={field.componentId}
                                  onChange={(e) => {
                                    updateComponent(index, {
                                      ...field,
                                      componentId: e.target.value,
                                    });
                                  }}
                                >
                                  {components.map((comp) => (
                                    <MenuItem key={comp._id} value={comp._id}>
                                      {comp.name} ({comp.code})
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              {component && (
                                <Chip
                                  icon={component.type === 'earning' ? <TrendingUp /> : <TrendingDown />}
                                  label={component.type}
                                  size="small"
                                  color={component.type === 'earning' ? 'success' : 'error'}
                                  sx={{ textTransform: 'capitalize' }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                size="small"
                                type="number"
                                value={field.value}
                                onChange={(e) => {
                                  updateComponent(index, {
                                    ...field,
                                    value: parseFloat(e.target.value) || 0,
                                    isOverridden: true,
                                  });
                                }}
                                InputProps={{
                                  startAdornment: component?.calculationType === 'percentage' ? '%' : '$',
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {component?.isTaxable ? (
                                <Chip label="Yes" size="small" color="warning" />
                              ) : (
                                <Chip label="No" size="small" variant="outlined" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeComponent(index)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Salary Summary */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total Earnings
                      </Typography>
                      <Typography variant="h6" color="success.main" fontWeight={600}>
                        ${totals.earnings.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total Deductions
                      </Typography>
                      <Typography variant="h6" color="error.main" fontWeight={600}>
                        ${totals.deductions.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Net Salary
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight={600}>
                        ${totals.net.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                onClick={handlePreview}
                disabled={previewPayroll.isPending}
              >
                Preview Payroll
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={setEmployeeSalary.isPending}
                >
                  Save Salary Configuration
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payroll Preview</DialogTitle>
        <DialogContent>
          {previewData && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                This is a preview of the monthly payroll calculation based on the current salary structure.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Earnings
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        {previewData.earnings?.map((earning: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{earning.name}</TableCell>
                            <TableCell align="right">${earning.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'success.light' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Total Earnings</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${previewData.totalEarnings?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Deductions
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        {previewData.deductions?.map((deduction: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{deduction.name}</TableCell>
                            <TableCell align="right">${deduction.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'error.light' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Total Deductions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${previewData.totalDeductions?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600}>
                        ${previewData.netPay?.toLocaleString()}
                      </Typography>
                      <Typography variant="h6">
                        Monthly Net Pay
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}