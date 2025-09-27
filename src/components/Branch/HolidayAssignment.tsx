import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Event,
  Business,
  Assignment,
  CheckCircle,
  Warning,
  Public,
  LocationOn,
  Church,
  Celebration,
  Star,
  Schedule,
  Save,
  Cancel,
  FilterList,
  SelectAll,
  Clear,
  CalendarToday,
  Info,
} from '@mui/icons-material';
import { format, isAfter, isBefore } from 'date-fns';
import { useHolidays, useBranchHolidays, useAssignHolidaysToBranch } from '../../hooks/useHolidays';
import { HolidayType, HolidayCategory } from '../../types/holiday';

interface HolidayAssignmentProps {
  branchId: string;
  branchName: string;
  onClose: () => void;
  year?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HolidayAssignment({ 
  branchId, 
  branchName, 
  onClose, 
  year = new Date().getFullYear() 
}: HolidayAssignmentProps) {
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<HolidayType | ''>('');
  const [filterCategory, setFilterCategory] = useState<HolidayCategory | ''>('');
  const [tabValue, setTabValue] = useState(0);
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(true);

  const { data: allHolidaysResponse } = useHolidays({ year, isActive: true });
  const { data: branchHolidaysResponse } = useBranchHolidays(branchId, year);
  const assignHolidays = useAssignHolidaysToBranch();

  const allHolidays = allHolidaysResponse?.data?.data || [];
  const branchHolidays = branchHolidaysResponse?.data || [];
  const assignedHolidayIds = branchHolidays.map(h => h._id);

  const filteredHolidays = allHolidays.filter(holiday => {
    let matches = true;
    
    if (filterType && holiday.type !== filterType) matches = false;
    if (filterCategory && holiday.category !== filterCategory) matches = false;
    if (showOnlyUnassigned && assignedHolidayIds.includes(holiday._id)) matches = false;
    
    return matches;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleHoliday = (holidayId: string) => {
    setSelectedHolidays(prev => 
      prev.includes(holidayId)
        ? prev.filter(id => id !== holidayId)
        : [...prev, holidayId]
    );
  };

  const handleSelectAll = () => {
    const availableIds = filteredHolidays
      .filter(h => !assignedHolidayIds.includes(h._id))
      .map(h => h._id);
    setSelectedHolidays(availableIds);
  };

  const handleClearSelection = () => {
    setSelectedHolidays([]);
  };

  const handleAssignHolidays = async () => {
    if (selectedHolidays.length === 0) return;

    try {
      await assignHolidays.mutateAsync({
        branchId,
        holidayIds: selectedHolidays
      });
      setSelectedHolidays([]);
      onClose();
    } catch (error) {
      console.error('Failed to assign holidays:', error);
    }
  };

  const getHolidayTypeIcon = (type: HolidayType) => {
    switch (type) {
      case HolidayType.NATIONAL:
        return <Public />;
      case HolidayType.REGIONAL:
        return <LocationOn />;
      case HolidayType.RELIGIOUS:
        return <Church />;
      case HolidayType.CULTURAL:
        return <Celebration />;
      case HolidayType.COMPANY:
        return <Business />;
      case HolidayType.FLOATING:
        return <Star />;
      case HolidayType.OPTIONAL:
        return <Schedule />;
      default:
        return <Event />;
    }
  };

  const getHolidayTypeColor = (type: HolidayType) => {
    switch (type) {
      case HolidayType.NATIONAL:
        return 'error';
      case HolidayType.REGIONAL:
        return 'warning';
      case HolidayType.RELIGIOUS:
        return 'secondary';
      case HolidayType.CULTURAL:
        return 'info';
      case HolidayType.COMPANY:
        return 'primary';
      case HolidayType.FLOATING:
        return 'success';
      case HolidayType.OPTIONAL:
        return 'default';
      default:
        return 'default';
    }
  };

  const holidayTypeOptions = [
    { value: HolidayType.NATIONAL, label: 'National Holidays' },
    { value: HolidayType.REGIONAL, label: 'Regional Holidays' },
    { value: HolidayType.RELIGIOUS, label: 'Religious Holidays' },
    { value: HolidayType.CULTURAL, label: 'Cultural Holidays' },
    { value: HolidayType.COMPANY, label: 'Company Holidays' },
    { value: HolidayType.FLOATING, label: 'Floating Holidays' },
    { value: HolidayType.OPTIONAL, label: 'Optional Holidays' },
  ];

  const categoryOptions = [
    { value: HolidayCategory.PUBLIC, label: 'Public Holidays' },
    { value: HolidayCategory.BANK, label: 'Bank Holidays' },
    { value: HolidayCategory.GOVERNMENT, label: 'Government Holidays' },
    { value: HolidayCategory.RELIGIOUS, label: 'Religious Holidays' },
    { value: HolidayCategory.CULTURAL, label: 'Cultural Holidays' },
    { value: HolidayCategory.SEASONAL, label: 'Seasonal Holidays' },
    { value: HolidayCategory.COMPANY_SPECIFIC, label: 'Company Specific' },
  ];

  const upcomingHolidays = filteredHolidays.filter(h => 
    isAfter(new Date(h.date), new Date())
  ).slice(0, 5);

  const pastHolidays = filteredHolidays.filter(h => 
    isBefore(new Date(h.date), new Date())
  );

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <CalendarToday />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Holiday Assignment - {branchName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assign holidays to branch for {year}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  {allHolidays.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Holidays
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  {branchHolidays.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={600} color="warning.main">
                  {allHolidays.length - branchHolidays.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={600} color="info.main">
                  {selectedHolidays.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Holiday Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as HolidayType)}
                    label="Holiday Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {holidayTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as HolidayCategory)}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyUnassigned}
                      onChange={(e) => setShowOnlyUnassigned(e.target.checked)}
                    />
                  }
                  label="Show Only Unassigned"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAll />}
                    onClick={handleSelectAll}
                    disabled={filteredHolidays.filter(h => !assignedHolidayIds.includes(h._id)).length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Clear />}
                    onClick={handleClearSelection}
                    disabled={selectedHolidays.length === 0}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Holiday Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Available Holidays (${filteredHolidays.length})`} />
              <Tab label={`Assigned Holidays (${branchHolidays.length})`} />
              <Tab label="Holiday Calendar Preview" />
            </Tabs>
          </Box>

          {/* Available Holidays Tab */}
          <TabPanel value={tabValue} index={0}>
            {filteredHolidays.length === 0 ? (
              <Alert severity="info">
                No holidays available for assignment. Try adjusting your filters.
              </Alert>
            ) : (
              <List>
                {filteredHolidays.map((holiday, index) => {
                  const isAssigned = assignedHolidayIds.includes(holiday._id);
                  const isSelected = selectedHolidays.includes(holiday._id);
                  
                  return (
                    <React.Fragment key={holiday._id}>
                      <ListItem
                        sx={{
                          bgcolor: isSelected ? 'action.selected' : 'transparent',
                          borderRadius: 2,
                          mb: 1,
                          opacity: isAssigned ? 0.5 : 1,
                        }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleHoliday(holiday._id)}
                            disabled={isAssigned}
                          />
                        </ListItemIcon>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `${getHolidayTypeColor(holiday.type)}.main` }}>
                            {getHolidayTypeIcon(holiday.type)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {holiday.name}
                              </Typography>
                              <Chip
                                label={holiday.type.replace('_', ' ')}
                                size="small"
                                color={getHolidayTypeColor(holiday.type) as any}
                                sx={{ textTransform: 'capitalize' }}
                              />
                              {holiday.isOptional && (
                                <Chip
                                  label="Optional"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {holiday.isFloating && (
                                <Chip
                                  label="Floating"
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                              )}
                              {isAssigned && (
                                <Chip
                                  label="Already Assigned"
                                  size="small"
                                  color="success"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {format(new Date(holiday.date), 'EEEE, MMMM dd, yyyy')}
                              </Typography>
                              {holiday.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {holiday.description}
                                </Typography>
                              )}
                              {holiday.country && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {holiday.country}{holiday.state && `, ${holiday.state}`}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < filteredHolidays.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </TabPanel>

          {/* Assigned Holidays Tab */}
          <TabPanel value={tabValue} index={1}>
            {branchHolidays.length === 0 ? (
              <Alert severity="info">
                No holidays assigned to this branch yet.
              </Alert>
            ) : (
              <List>
                {branchHolidays.map((holiday, index) => (
                  <React.Fragment key={holiday._id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${getHolidayTypeColor(holiday.type)}.main` }}>
                          {getHolidayTypeIcon(holiday.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {holiday.name}
                            </Typography>
                            <Chip
                              label={holiday.type.replace('_', ' ')}
                              size="small"
                              color={getHolidayTypeColor(holiday.type) as any}
                              sx={{ textTransform: 'capitalize' }}
                            />
                            {holiday.isOptional && (
                              <Chip
                                label="Optional"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(holiday.date), 'EEEE, MMMM dd, yyyy')}
                            </Typography>
                            {holiday.description && (
                              <Typography variant="caption" color="text.secondary">
                                {holiday.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            // Remove holiday from branch
                            console.log('Remove holiday:', holiday._id);
                          }}
                        >
                          Remove
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < branchHolidays.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </TabPanel>

          {/* Calendar Preview Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Holiday Calendar Preview for {year}
            </Typography>
            
            <Grid container spacing={2}>
              {/* Upcoming Holidays */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Upcoming Holidays
                    </Typography>
                    <List dense>
                      {upcomingHolidays.map((holiday) => (
                        <ListItem key={holiday._id}>
                          <ListItemIcon>
                            <Chip
                              icon={getHolidayTypeIcon(holiday.type)}
                              label={format(new Date(holiday.date), 'MMM dd')}
                              size="small"
                              color={getHolidayTypeColor(holiday.type) as any}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={holiday.name}
                            secondary={holiday.type.replace('_', ' ')}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Holiday Statistics */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Holiday Statistics
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Holiday Distribution by Type
                      </Typography>
                      {holidayTypeOptions.map((type) => {
                        const count = branchHolidays.filter(h => h.type === type.value).length;
                        const percentage = branchHolidays.length > 0 ? (count / branchHolidays.length) * 100 : 0;
                        
                        return (
                          <Box key={type.value} sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption">
                                {type.label}
                              </Typography>
                              <Typography variant="caption">
                                {count} ({percentage.toFixed(0)}%)
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Optional Holidays
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {branchHolidays.filter(h => h.isOptional).length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Floating Holidays
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {branchHolidays.filter(h => h.isFloating).length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Working Days Lost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {branchHolidays.filter(h => !h.isOptional && !h.isFloating).length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Weekend Holidays
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {branchHolidays.filter(h => {
                            const day = new Date(h.date).getDay();
                            return day === 0 || day === 6; // Sunday or Saturday
                          }).length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Card>

        {/* Selection Summary */}
        {selectedHolidays.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>{selectedHolidays.length} holidays selected</strong> for assignment to {branchName}.
              These holidays will be added to the branch calendar and will affect employee leave calculations.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setFilterType('');
              setFilterCategory('');
              setSelectedHolidays([]);
              setShowOnlyUnassigned(true);
            }}
            startIcon={<FilterList />}
          >
            Reset Filters
          </Button>
          
          <Button
            variant="contained"
            onClick={handleAssignHolidays}
            disabled={selectedHolidays.length === 0 || assignHolidays.isPending}
            startIcon={<Assignment />}
          >
            {assignHolidays.isPending 
              ? 'Assigning...' 
              : `Assign ${selectedHolidays.length} Holiday${selectedHolidays.length !== 1 ? 's' : ''}`
            }
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}