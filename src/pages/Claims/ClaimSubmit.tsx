import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Receipt,
  AttachMoney,
  Description,
  CheckCircle,
  ArrowBack,
  Save,
  Send,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  receipt?: File;
}

export default function ClaimSubmit() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  
  const [activeStep, setActiveStep] = useState(0);
  const [claimType, setClaimType] = useState('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<ExpenseItem>>({
    category: '',
    amount: 0,
    description: '',
    date: new Date(),
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [comments, setComments] = useState('');

  const steps = ['Claim Details', 'Add Expenses', 'Upload Receipts', 'Review & Submit'];

  const expenseCategories = [
    'Travel',
    'Accommodation',
    'Meals',
    'Transportation',
    'Equipment',
    'Training',
    'Communication',
    'Office Supplies',
    'Client Entertainment',
    'Other',
  ];

  const claimTypes = [
    { value: 'expense', label: 'Expense Reimbursement' },
    { value: 'travel', label: 'Travel Claim' },
    { value: 'medical', label: 'Medical Reimbursement' },
    { value: 'equipment', label: 'Equipment Purchase' },
    { value: 'training', label: 'Training & Development' },
  ];

  const handleAddExpenseItem = () => {
    if (!currentItem.category || !currentItem.amount || !currentItem.description) {
      addNotification({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      category: currentItem.category!,
      amount: currentItem.amount!,
      description: currentItem.description!,
      date: currentItem.date || new Date(),
    };

    setExpenseItems([...expenseItems, newItem]);
    setCurrentItem({
      category: '',
      amount: 0,
      description: '',
      date: new Date(),
    });

    addNotification({
      title: 'Item Added',
      message: 'Expense item added successfully',
      type: 'success'
    });
  };

  const handleRemoveExpenseItem = (id: string) => {
    setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (activeStep === 0 && !claimType) {
      addNotification({
        title: 'Validation Error',
        message: 'Please select a claim type',
        type: 'error'
      });
      return;
    }

    if (activeStep === 1 && expenseItems.length === 0) {
      addNotification({
        title: 'Validation Error',
        message: 'Please add at least one expense item',
        type: 'error'
      });
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Mock API call
      console.log('Submitting claim:', {
        type: claimType,
        items: expenseItems,
        files: uploadedFiles,
        comments,
        submittedBy: user?._id,
      });

      addNotification({
        title: 'Claim Submitted',
        message: 'Your expense claim has been submitted successfully',
        type: 'success'
      });

      navigate('/claims');
    } catch (error) {
      addNotification({
        title: 'Submission Failed',
        message: 'Failed to submit claim. Please try again.',
        type: 'error'
      });
    }
  };

  const getTotalAmount = () => {
    return expenseItems.reduce((total, item) => total + item.amount, 0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Claim Type</InputLabel>
                <Select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  label="Claim Type"
                >
                  {claimTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Any additional information about this claim..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Expense Item
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={currentItem.category || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                        label="Category"
                      >
                        {expenseCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Amount"
                      value={currentItem.amount || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, amount: parseFloat(e.target.value) || 0 })}
                      InputProps={{
                        startAdornment: '$',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Expense Date"
                      value={currentItem.date || null}
                      onChange={(date) => setCurrentItem({ ...currentItem, date: date || new Date() })}
                      slotProps={{
                        textField: { fullWidth: true, required: true }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Description"
                      value={currentItem.description || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                      placeholder="Brief description of the expense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleAddExpenseItem}
                      startIcon={<AttachMoney />}
                    >
                      Add Expense Item
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {expenseItems.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Expense Items ({expenseItems.length})
                  </Typography>
                  <List>
                    {expenseItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={item.category} size="small" />
                                <Typography variant="body1" fontWeight={600}>
                                  ${item.amount.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  {item.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.date.toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleRemoveExpenseItem(item.id)}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < expenseItems.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      Total Amount: ${getTotalAmount().toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Receipts
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please upload clear images or PDFs of your receipts. Supported formats: JPG, PNG, PDF
                </Alert>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />
                </Button>
              </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Uploaded Files ({uploadedFiles.length})
                  </Typography>
                  <List>
                    {uploadedFiles.map((file, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < uploadedFiles.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your claim details before submitting
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Claim Summary
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Claim Type
                      </Typography>
                      <Typography variant="body1">
                        {claimTypes.find(t => t.value === claimType)?.label}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h5" color="primary">
                        ${getTotalAmount().toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Number of Items
                      </Typography>
                      <Typography variant="body1">
                        {expenseItems.length} expense items
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Receipts Uploaded
                      </Typography>
                      <Typography variant="body1">
                        {uploadedFiles.length} files
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Expense Breakdown
                    </Typography>
                    <List dense>
                      {expenseItems.map((item) => (
                        <ListItem key={item.id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">
                                  {item.category} - {item.description}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  ${item.amount.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                            secondary={item.date.toLocaleDateString()}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/claims')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Submit Expense Claim
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit your expense reimbursement claim
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={() => {
              addNotification({
                title: 'Draft Saved',
                message: 'Your claim has been saved as draft',
                type: 'info'
              });
            }}
          >
            Save Draft
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<Send />}
            >
              Submit Claim
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}