import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  color = 'primary',
  onClick,
}: QuickActionCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: 48,
                height: 48,
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}