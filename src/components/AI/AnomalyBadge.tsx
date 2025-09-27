import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';

interface AnomalyBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  count?: number;
  description?: string;
}

export default function AnomalyBadge({ 
  severity, 
  count, 
  description 
}: AnomalyBadgeProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <Error />;
      case 'medium':
        return <Warning />;
      default:
        return <Info />;
    }
  };

  const label = count ? `${count} ${severity}` : severity;

  return (
    <Tooltip title={description || `${severity} severity anomaly detected`}>
      <Chip
        icon={getSeverityIcon()}
        label={label}
        size="small"
        color={getSeverityColor() as any}
        sx={{ textTransform: 'capitalize' }}
      />
    </Tooltip>
  );
}