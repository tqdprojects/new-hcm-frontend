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
  IconButton,
  Tooltip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Computer,
  Smartphone,
  Monitor,
  Chair,
  DirectionsCar,
  Add,
  Edit,
  Visibility,
  QrCode,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  FilterList,
} from '@mui/icons-material';

export default function AssetRegistry() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const assetStats = [
    {
      title: 'Total Assets',
      value: '1,247',
      subtitle: 'Across all categories',
      color: 'primary',
      icon: Computer,
    },
    {
      title: 'Available',
      value: '156',
      subtitle: 'Ready for assignment',
      color: 'success',
      icon: CheckCircle,
    },
    {
      title: 'Assigned',
      value: '1,091',
      subtitle: 'Currently in use',
      color: 'warning',
      icon: Assignment,
    },
    {
      title: 'Maintenance',
      value: '12',
      subtitle: 'Under service',
      color: 'error',
      icon: Warning,
    },
  ];

  const assetCategories = [
    { name: 'Laptops', count: 450, assigned: 89, icon: Computer },
    { name: 'Desktops', count: 320, assigned: 95, icon: Monitor },
    { name: 'Mobile Devices', count: 280, assigned: 78, icon: Smartphone },
    { name: 'Monitors', count: 197, assigned: 85, icon: Monitor },
    { name: 'Furniture', count: 150, assigned: 92, icon: Chair },
    { name: 'Vehicles', count: 25, assigned: 88, icon: DirectionsCar },
  ];

  const recentAssets = [
    {
      id: 'LAP001',
      name: 'MacBook Pro M3',
      category: 'Laptop',
      assignedTo: 'John Doe',
      status: 'assigned',
      purchaseDate: '2024-01-15',
      value: 2499,
    },
    {
      id: 'MOB001',
      name: 'iPhone 15 Pro',
      category: 'Mobile',
      assignedTo: 'Sarah Wilson',
      status: 'assigned',
      purchaseDate: '2024-02-10',
      value: 1199,
    },
    {
      id: 'DES001',
      name: 'Dell OptiPlex',
      category: 'Desktop',
      assignedTo: null,
      status: 'available',
      purchaseDate: '2024-03-05',
      value: 899,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'assigned': return 'info';
      case 'maintenance': return 'warning';
      case 'retired': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Asset Registry
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage IT assets and equipment inventory
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Add Asset
        </Button>
      </Box>

      {/* Asset Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {assetStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    <stat.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Asset Categories */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Asset Categories
          </Typography>
          <Grid container spacing={3}>
            {assetCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <category.icon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.count} units • {category.assigned}% assigned
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="laptop">Laptops</MenuItem>
                  <MenuItem value="desktop">Desktops</MenuItem>
                  <MenuItem value="mobile">Mobile Devices</MenuItem>
                  <MenuItem value="monitor">Monitors</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
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
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setCategoryFilter('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAssets.map((asset) => (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {asset.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {asset.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={asset.category}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {asset.assignedTo || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={asset.status}
                        size="small"
                        color={getStatusColor(asset.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{asset.purchaseDate}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${asset.value.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Asset">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="QR Code">
                          <IconButton size="small">
                            <QrCode />
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
    </Box>
  );
}