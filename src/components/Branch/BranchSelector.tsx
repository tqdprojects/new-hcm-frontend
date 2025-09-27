import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Typography,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Business, LocationOn } from '@mui/icons-material';
import { useBranches } from '../../hooks/useBranches';
import { IBranch } from '../../types/branch';

interface BranchSelectorProps {
  value: string;
  onChange: (branchId: string) => void;
  label?: string;
  multiple?: boolean;
  showAll?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export default function BranchSelector({
  value,
  onChange,
  label = 'Branch',
  multiple = false,
  showAll = true,
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  helperText,
  error = false,
  required = false,
  fullWidth = true,
}: BranchSelectorProps) {
  const { data: branchesResponse, isLoading } = useBranches();
  const branches = branchesResponse?.data || [];

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const selectedValue = event.target.value;
    if (multiple) {
      onChange(selectedValue as string);
    } else {
      onChange(selectedValue as string);
    }
  };

  const renderBranchOption = (branch: IBranch) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
        <Business fontSize="small" />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {branch.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationOn sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {branch.address?.city}, {branch.address?.state}
          </Typography>
          <Chip
            label={branch.code}
            size="small"
            variant="outlined"
            sx={{ ml: 1, height: 16, fontSize: '0.65rem' }}
          />
        </Box>
      </Box>
      {branch.isActive && (
        <Chip
          label="Active"
          size="small"
          color="success"
          sx={{ height: 20, fontSize: '0.7rem' }}
        />
      )}
    </Box>
  );

  const renderSelectedValue = (selected: string | string[]) => {
    if (multiple) {
      const selectedBranches = (selected as string[]).map(id => 
        branches.find(branch => branch.id === id)
      ).filter(Boolean);
      
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedBranches.map((branch) => (
            <Chip
              key={branch!.id}
              label={branch!.name}
              size="small"
              onDelete={() => {
                const newSelected = (selected as string[]).filter(id => id !== branch!.id);
                onChange(newSelected.join(','));
              }}
            />
          ))}
        </Box>
      );
    } else {
      const selectedBranch = branches.find(branch => branch.id === selected);
      if (!selectedBranch) return '';
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
            <Business fontSize="small" />
          </Avatar>
          <Typography variant="body2">
            {selectedBranch.name} ({selectedBranch.code})
          </Typography>
        </Box>
      );
    }
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      disabled={disabled || isLoading}
      error={error}
      required={required}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        multiple={multiple}
        renderValue={renderSelectedValue}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 300 }
          }
        }}
      >
        {showAll && !multiple && (
          <MenuItem value="">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
                <Business fontSize="small" />
              </Avatar>
              <Typography variant="subtitle2">
                All Branches
              </Typography>
            </Box>
          </MenuItem>
        )}
        
        {branches.map((branch) => (
          <MenuItem key={branch.id} value={branch.id}>
            {renderBranchOption(branch)}
          </MenuItem>
        ))}
        
        {branches.length === 0 && !isLoading && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No branches available
            </Typography>
          </MenuItem>
        )}
      </Select>
      
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5, ml: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
}