import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  People,
  AttachMoney,
  BeachAccess,
  Work,
  BarChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ReportDashboard() {
  const navigate = useNavigate();

  const reportCategories = [
    {
      title: 'Attendance Reports',
      description: 'Employee attendance and time tracking reports',
      icon: TrendingUp,
      color: 'primary',
      path: '/reports/attendance',
    },
    {
      title: 'Leave Reports',
      description: 'Leave balance and usage analytics',
      icon: BeachAccess,
      color: 'success',
      path: '/reports/leaves',
    },
    {
      title: 'Payroll Reports',
      description: 'Salary and compensation analysis',
      icon: AttachMoney,
      color: 'secondary',
      path: '/reports/payroll',
    },
    {
      title: 'Performance Reports',
      description: 'Employee performance and goal tracking',
      icon: Assessment,
      color: 'warning',
      path: '/reports/performance',
    },
    {
      title: 'Recruitment Reports',
      description: 'Hiring pipeline and candidate analytics',
      icon: Work,
      color: 'info',
      path: '/reports/recruitment',
    },
    {
      title: 'Custom Reports',
      description: 'Build custom reports with filters',
      icon: BarChart,
      color: 'error',
      path: '/reports/custom',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Reports Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and view comprehensive reports
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {reportCategories.map((category, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate(category.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${category.color}.main`, width: 56, height: 56 }}>
                    <category.icon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  color={category.color as any}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(category.path);
                  }}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}