import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack,
  Receipt,
  AttachMoney,
  Person,
  Schedule,
  CheckCircle,
  Close,
  Download,
  Visibility,
  Edit,
  Comment,
  Attachment,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { format } from 'date-fns';

export default function ClaimDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
  }>({ open: false, action: 'approve' });
  const [comments, setComments] = useState('');

  const canManageClaims = ['finance', 'hr', 'manager', 'tenant-admin'].includes(user?.role || '');

  // Mock data for demonstration
  const claim = {
    id: '1',
    claimNumber: 'CLM001',
    employee: {
      id: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      avatar: '/avatars/john.jpg',
    },
    type: 'Travel',
    status: 'pending',
    totalAmount: 1250,
    currency: 'USD',
    description: 'Client meeting travel expenses for Q4 business review',
    submittedDate: '2024-12-02T10:30:00Z',
    expenseDate: '2024-12-01',
    approver: {
      id: 'MGR001',
      name: 'Finance Manager',
      email: 'finance@company.com',
    },
    items: [
      {
        id: '1',
        category: 'Flight',
        amount: 650,
        description: 'Round trip flight to New York',
        date: '2024-12-01',
        receipt: 'flight-receipt.pdf',
      },
      {
        id: '2',
        category: 'Hotel',
        amount: 400,
        description: '2 nights at Marriott Hotel',
        date: '2024-12-01',
        receipt: 'hotel-receipt.pdf',
      },
      {
        id: '3',
        category: 'Meals',
        amount: 150,
        description: 'Client dinner and meals',
        date: '2024-12-01',
        receipt: 'meals-receipt.pdf',
      },
      {
        id: '4',
        category: 'Transportation',
        amount: 50,
        description: 'Airport transfers and local transport',
        date: '2024-12-01',
        receipt: 'transport-receipt.pdf',
      },
    ],
    attachments: [
      { name: 'flight-receipt.pdf', size: '245 KB', type: 'pdf' },
      { name: 'hotel-receipt.pdf', size: '189 KB', type: 'pdf' },
      { name: 'meals-receipt.jpg', size: '1.2 MB', type: 'image' },
      { name: 'transport-receipt.jpg', size: '890 KB', type: 'image' },
    ],
    timeline: [
      {
        id: '1',
        action: 'Claim Submitted',
        user: 'John Doe',
        timestamp: '2024-12-02T10:30:00Z',
        status: 'submitted',
        comments: 'Expense claim submitted for approval',
      },
      {
        id: '2',
        action: 'Under Review',
        user: 'Finance Manager',
        timestamp: '2024-12-02T14:15:00Z',
        status: 'review',
        comments: 'Claim assigned for review',
      },
    ],
    comments: [
      {
        id: '1',
        user: 'John Doe',
        timestamp: '2024-12-02T10:35:00Z',
        message: 'All receipts have been attached. The client meeting was successful and resulted in a new contract.',
      },
    ],
  };

  const handleApprovalAction = async () => {
    const { action } = approvalDialog;
    
    // Mock API call
    console.log(`${action}ing claim ${id} with comments:`, comments);
    
    addNotification({
      title: `Claim ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Expense claim has been ${action}d successfully`,
      type: action === 'approve' ? 'success' : 'info'
    });
    
    setApprovalDialog({ open: false, action: 'approve' });
    setComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'paid':
        return 'info';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Close />;
      case 'paid':
        return <AttachMoney />;
      case 'pending':
      default:
        return <Schedule />;
    }
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Receipt />;
      case 'review':
        return <Visibility />;
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Close />;
      default:
        return <Schedule />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/claims')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Claim #{claim.claimNumber}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submitted by {claim.employee.name} on {format(new Date(claim.submittedDate), 'MMM dd, yyyy')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              addNotification({
                title: 'Download Started',
                message: 'Claim details are being downloaded',
                type: 'info'
              });
            }}
          >
            Download
          </Button>
          
          {claim.status === 'pending' && canManageClaims && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Close />}
                onClick={() => setApprovalDialog({ open: true, action: 'reject' })}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => setApprovalDialog({ open: true, action: 'approve' })}
              >
                Approve
              </Button>
            </>
          )}
          
          {user?.role === 'employee' && claim.status === 'pending' && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate(`/claims/${id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Claim Overview */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Claim Overview
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(claim.status)}
                      label={claim.status}
                      color={getStatusColor(claim.status) as any}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip label={claim.type} variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    ${claim.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {claim.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {claim.employee.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {claim.employee.department} • {claim.employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>
                      <Schedule />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Expense Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(claim.expenseDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Expense Items */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense Items ({claim.items.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Receipt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {claim.items.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Chip label={item.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${item.amount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => {
                              addNotification({
                                title: 'Receipt Opened',
                                message: `Opening ${item.receipt}`,
                                type: 'info'
                              });
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        ${claim.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attachments ({claim.attachments.length})
              </Typography>
              <List>
                {claim.attachments.map((attachment, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <Attachment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={attachment.name}
                        secondary={`${attachment.size} • ${attachment.type.toUpperCase()}`}
                      />
                      <IconButton
                        onClick={() => {
                          addNotification({
                            title: 'Download Started',
                            message: `Downloading ${attachment.name}`,
                            type: 'info'
                          });
                        }}
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                    {index < claim.attachments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline & Comments */}
        <Grid item xs={12} lg={4}>
          {/* Timeline */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Claim Timeline
              </Typography>
              <List>
                {claim.timeline.map((event, index) => (
                  <ListItem key={event.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      width: '100%', 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 2,
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getTimelineIcon(event.status)}
                        <Typography variant="body2" fontWeight={600}>
                          {event.action}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {event.user} • {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      {event.comments && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {event.comments}
                        </Typography>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              {claim.comments.length > 0 ? (
                <List>
                  {claim.comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Comment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {comment.user}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(comment.timestamp), 'MMM dd, HH:mm')}
                              </Typography>
                            </Box>
                          }
                          secondary={comment.message}
                        />
                      </ListItem>
                      {index < claim.comments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog.open}
        onClose={() => setApprovalDialog({ open: false, action: 'approve' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'} Expense Claim
        </DialogTitle>
        <DialogContent>
          <Alert 
            severity={approvalDialog.action === 'approve' ? 'success' : 'warning'}
            sx={{ mb: 2 }}
          >
            Are you sure you want to {approvalDialog.action} this expense claim for ${claim.totalAmount.toLocaleString()}?
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={`${approvalDialog.action === 'approve' ? 'Approval' : 'Rejection'} Comments`}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={`Enter ${approvalDialog.action === 'approve' ? 'approval' : 'rejection'} comments...`}
            required={approvalDialog.action === 'reject'}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApprovalDialog({ open: false, action: 'approve' })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={approvalDialog.action === 'approve' ? 'success' : 'error'}
            onClick={handleApprovalAction}
            disabled={approvalDialog.action === 'reject' && !comments.trim()}
          >
            {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'} Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}