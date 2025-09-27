import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Chip,
} from '@mui/material';
import {
  Flight,
  Restaurant,
  School,
  Work,
  Warning,
  Info,
  CheckCircle,
} from '@mui/icons-material';

export default function ClaimPolicies() {
  const policyCategories = [
    {
      title: 'Travel Expenses',
      icon: Flight,
      color: 'primary',
      rules: [
        'Maximum hotel rate: $200 per night',
        'Flight bookings must be economy class',
        'Advance approval required for international travel',
        'Receipts mandatory for all expenses above $25',
      ],
    },
    {
      title: 'Meals & Entertainment',
      icon: Restaurant,
      color: 'success',
      rules: [
        'Maximum $50 per person for client meals',
        'Business purpose must be clearly documented',
        'Alcohol expenses limited to 20% of total bill',
        'Team meals require manager approval',
      ],
    },
    {
      title: 'Training & Development',
      icon: School,
      color: 'secondary',
      rules: [
        'Annual training budget: $2,000 per employee',
        'Pre-approval required for courses above $500',
        'Certification exam fees fully covered',
        'Conference attendance limited to 2 per year',
      ],
    },
    {
      title: 'Office Supplies',
      icon: Work,
      color: 'warning',
      rules: [
        'Monthly limit: $100 per employee',
        'Bulk purchases require procurement approval',
        'Personal use items not reimbursable',
        'Equipment purchases above $200 need IT approval',
      ],
    },
  ];

  const importantNotes = [
    'All claims must be submitted within 30 days of expense',
    'Original receipts required for reimbursement',
    'False claims may result in disciplinary action',
    'Reimbursement processed within 7 business days of approval',
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Expense Policies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Company expense policies and guidelines
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {policyCategories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                borderLeft: `4px solid`,
                borderLeftColor: `${category.color}.main`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${category.color}.main` }}>
                    <category.icon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    {category.title}
                  </Typography>
                </Box>
                
                <List dense>
                  {category.rules.map((rule, ruleIndex) => (
                    <ListItem key={ruleIndex} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 16, color: `${category.color}.main` }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {rule}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Important Notes */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Important Notes
            </Typography>
            <List dense>
              {importantNotes.map((note, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {note}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}