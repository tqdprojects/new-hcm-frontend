import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Download,
  Visibility,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import { useDynamicList } from '../../hooks/useDynamicData';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useDebounce } from '../../hooks/useDebounce';

interface LiveDataTableProps {
  title: string;
  endpoint: string;
  queryKey: string[];
  columns: GridColDef[];
  realTimeEvents?: string[];
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  actions?: Array<{
    label: string;
    icon: React.ComponentType;
    onClick: (row: any) => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    show?: (row: any) => boolean;
  }>;
  onRowClick?: (row: any) => void;
  enableSearch?: boolean;
  enableExport?: boolean;
  enableAdd?: boolean;
  onAdd?: () => void;
  refreshInterval?: number;
}

export default function LiveDataTable({
  title,
  endpoint,
  queryKey,
  columns,
  realTimeEvents = [],
  filters = [],
  actions = [],
  onRowClick,
  enableSearch = true,
  enableExport = false,
  enableAdd = false,
  onAdd,
  refreshInterval = 30000,
}: LiveDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Dynamic data fetching with real-time updates
  const {
    data,
    isLoading,
    error,
    refetch,
    updatePagination,
    updateFilters,
    updateSearch,
    clearFilters,
  } = useDynamicList({
    endpoint,
    queryKey,
    pagination: {
      page: paginationModel.page + 1, // API uses 1-based pagination
      limit: paginationModel.pageSize,
    },
    filters: filterValues,
    search: debouncedSearch,
  });

  // Real-time data synchronization
  const { isConnected } = useRealTimeData({
    queryKeys: [queryKey],
    events: realTimeEvents,
    onUpdate: (event, updateData) => {
      console.log(`🔄 Live table update [${event}]:`, updateData);
      // Data will be automatically refreshed by the hook
    },
  });

  // Update search when debounced value changes
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  // Update pagination when model changes
  useEffect(() => {
    updatePagination({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    });
  }, [paginationModel, updatePagination]);

  // Update filters when filter values change
  useEffect(() => {
    updateFilters(filterValues);
  }, [filterValues, updateFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterValues({});
    clearFilters();
  };

  const handleExport = async () => {
    try {
      // Implementation would call export API
      console.log('Exporting data with filters:', { searchTerm, filterValues });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Enhanced columns with actions
  const enhancedColumns: GridColDef[] = [
    ...columns,
    ...(actions.length > 0 ? [{
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {actions.map((action, index) => {
            if (action.show && !action.show(params.row)) return null;
            
            return (
              <Tooltip key={index} title={action.label}>
                <IconButton
                  size="small"
                  color={action.color || 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(params.row);
                  }}
                >
                  <action.icon />
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      ),
    }] : []),
  ];

  const rows = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Card>
      <CardContent>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(0, 121, 107, 0.05) 100%)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          border: '1px solid rgba(25, 118, 210, 0.1)',
        }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Chip
              size="small"
              label={isConnected ? 'Live' : 'Offline'}
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
              sx={{
                animation: isConnected ? 'pulse 2s infinite' : 'none',
                fontWeight: 600,
              }}
            />
            {isLoading && <CircularProgress size={16} />}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={() => refetch()} disabled={isLoading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            
            {enableExport && (
              <Button
                size="small"
                startIcon={<Download />}
                onClick={handleExport}
              >
                Export
              </Button>
            )}
            
            {enableAdd && onAdd && (
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={onAdd}
              >
                Add
              </Button>
            )}
          </Box>
        </Box>
        </Box>

        {/* Filters */}
        {(enableSearch || filters.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {enableSearch && (
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{ minWidth: 200 }}
                />
              )}
              
              {filters.map((filter) => (
                <FormControl key={filter.key} size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    label={filter.label}
                  >
                    <MenuItem value="">All</MenuItem>
                    {filter.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              
              {(searchTerm || Object.keys(filterValues).length > 0) && (
                <Button
                  size="small"
                  startIcon={<FilterList />}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load data. Please try refreshing.
          </Alert>
        )}

        {/* Data Grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={enhancedColumns}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            rowCount={pagination?.total || 0}
            paginationMode="server"
            disableRowSelectionOnClick
            onRowClick={onRowClick ? (params: GridRowParams) => onRowClick(params.row) : undefined}
            getRowId={(row) => row._id || row.id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
                cursor: onRowClick ? 'pointer' : 'default',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'divider',
              },
            }}
          />
        </Box>

        {/* Real-time indicator */}
        {isConnected && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Live updates enabled
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}