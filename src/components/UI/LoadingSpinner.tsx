import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Loading...',
  fullScreen = false,
  color = 'primary',
}) => {
  const content = (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
          }),
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={size}
            color={color}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: size * 0.3,
                height: size * 0.3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2, #00796b)',
                animation: 'pulse 2s infinite',
              }}
            />
          </Box>
        </Box>
        
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              animation: 'fadeInUp 0.6s ease-out',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );

  return content;
};

export default LoadingSpinner;