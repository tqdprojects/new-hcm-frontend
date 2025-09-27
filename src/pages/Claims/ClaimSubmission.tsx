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
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Save,
  Send,
  Receipt,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';

export default function ClaimSubmission() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  
  const [formData, setFormData] = useState({
    expenseType: '',
    amount: '',
    description: '',
    expenseDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addNotification({
      title: 'Claim Submitted',
      message: 'Your expense claim has been submitted successfully',
      type: 'success'
    });
    
    navigate('/claims');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Submit Expense Claim
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit your business expenses for reimbursement
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Expense Type</InputLabel>
                  <Select
                    value={formData.expenseType}
                    onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                    label="Expense Type"
                  >
                    <MenuItem value="travel">Travel</MenuItem>
                    <MenuItem value="meals">Meals & Entertainment</MenuItem>
                    <MenuItem value="supplies">Office Supplies</MenuItem>
                    <MenuItem value="training">Training & Development</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  InputProps={{
                    startAdornment: '$',
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide details about the expense..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Expense Date"
                  value={formData.expenseDate}
                  onChange={(date) => setFormData({ ...formData, expenseDate: date || new Date() })}
                  slotProps={{
                    textField: { fullWidth: true, required: true }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Receipt sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Drag and drop receipts here, or click to browse
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                  >
                    Choose Files
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Send />}
                  >
                    Submit Claim
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}