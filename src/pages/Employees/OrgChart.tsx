import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Business,
  Engineering,
  Sales,
  Psychology,
  AccountBalance,
  People,
} from '@mui/icons-material';

export default function OrgChart() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Organization Chart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visual representation of company hierarchy
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Card variant="outlined" sx={{ display: 'inline-block', p: 3, bgcolor: 'primary.light' }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
                <Business sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="primary.dark">
                CEO
              </Typography>
              <Typography variant="body2" color="primary.dark">
                Chief Executive Officer
              </Typography>
            </Card>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'success.light' }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'success.main', width: 56, height: 56 }}>
                    <Engineering sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color="success.dark">
                    CTO
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    Chief Technology Officer
                  </Typography>
                </Card>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Engineering Manager
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        15 developers
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        QA Manager
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        8 testers
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'secondary.light' }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <Psychology sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color="secondary.dark">
                    CHO
                  </Typography>
                  <Typography variant="body2" color="secondary.dark">
                    Chief Human Resources Officer
                  </Typography>
                </Card>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        HR Manager
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        5 specialists
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Talent Acquisition
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        3 recruiters
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'warning.light' }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'warning.main', width: 56, height: 56 }}>
                    <AccountBalance sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color="warning.dark">
                    CFO
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Chief Financial Officer
                  </Typography>
                </Card>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Finance Manager
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        4 analysts
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Accounting
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        3 accountants
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}