import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'percentage';
  icon?: React.ComponentType;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon: Icon,
  color = 'primary',
}: MetricCardProps) {
  const getChangeIcon = () => {
    if (changeType === 'percentage') return null;
    return change && change > 0 ? TrendingUp : TrendingDown;
  };

  const getChangeColor = () => {
    if (changeType === 'percentage') return 'text.secondary';
    return change && change > 0 ? 'success.main' : 'error.main';
  };

  const formatChange = () => {
    if (!change) return null;
    
    if (changeType === 'percentage') {
      return `${change}%`;
    }
    
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  const ChangeIcon = getChangeIcon();

  return (
    <Fade in timeout={600}>
      <Card
        className="metric-card"
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${color || '#1976d2'}, ${color || '#00796b'})`,
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease',
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            borderColor: `${color || '#1976d2'}33`,
          },
          '&:hover::before': {
            transform: 'translateX(0)',
          },
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 0.5, 
                  background: `linear-gradient(135deg, ${color || '#1976d2'}, ${color || '#00796b'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  transition: 'all 0.3s ease',
                }}
              >
                {value}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.75rem',
                }}
              >
                {title}
              </Typography>
            </Box>
            {Icon && (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: `linear-gradient(135deg, ${color || '#1976d2'}15, ${color || '#1976d2'}25)`,
                  color: color || '#1976d2',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(10deg) scale(1.1)',
                  },
                }}
              >
                <Icon sx={{ fontSize: 28 }} />
              </Avatar>
            )}
          </Box>
          
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mb: 2,
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {change !== undefined && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1,
                p: 1.5,
                borderRadius: 2,
                background: changeType === 'increase' 
                  ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02))'
                  : 'linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(244, 67, 54, 0.02))',
                border: `1px solid ${changeType === 'increase' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
              }}
            >
              {ChangeIcon && (
                <ChangeIcon
                  sx={{
                    fontSize: 18,
                    color: getChangeColor(),
                    mr: 1,
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: getChangeColor(),
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {formatChange()}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  ml: 1,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              >
                {changeType !== 'percentage' && 'vs last period'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
}