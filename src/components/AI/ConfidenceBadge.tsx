import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { Psychology } from '@mui/icons-material';

interface ConfidenceBadgeProps {
  confidence: number;
  showIcon?: boolean;
  size?: 'small' | 'medium';
}

export default function ConfidenceBadge({ 
  confidence, 
  showIcon = true, 
  size = 'small' 
}: ConfidenceBadgeProps) {
  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = () => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  };

  return (
    <Tooltip title={`AI Confidence: ${Math.round(confidence * 100)}%`}>
      <Chip
        icon={showIcon ? <Psychology /> : undefined}
        label={`${getConfidenceLabel()} (${Math.round(confidence * 100)}%)`}
        size={size}
        color={getConfidenceColor() as any}
        variant="outlined"
      />
    </Tooltip>
  );
}