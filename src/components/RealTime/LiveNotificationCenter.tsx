import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Warning,
  Error,
  Info,
  MarkEmailRead,
  Settings,
  Clear,
} from '@mui/icons-material';
import { useRealTimeNotifications } from '../../hooks/useRealTimeNotifications';
import { useNotificationStore } from '../../stores/notificationStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function LiveNotificationCenter() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const { 
    isConnected, 
    unreadCount, 
    requestNotificationPermission,
    markAsRead: markAsReadRealTime,
    markAllAsRead: markAllAsReadRealTime 
  } = useRealTimeNotifications();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    markAsReadRealTime(notification.id);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      handleClose();
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    markAllAsReadRealTime();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'error':
        return <Error sx={{ color: 'error.main' }} />;
      default:
        return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={`${unreadCount} unread notifications`}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ position: 'relative' }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
              },
            }}
          >
            <Notifications />
          </Badge>
          
          {/* Connection indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? 'success.main' : 'error.main',
              border: '1px solid white',
            }}
          />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 400, 
            maxHeight: 600,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: 3,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>
              <Chip
                size="small"
                label={isConnected ? 'Live' : 'Offline'}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Notification Settings">
                <IconButton 
                  size="small"
                  onClick={() => {
                    navigate('/settings/notifications');
                    handleClose();
                  }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear All">
                <IconButton 
                  size="small" 
                  onClick={() => {
                    clearAll();
                    handleClose();
                  }}
                  disabled={notifications.length === 0}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              size="small"
              onClick={requestNotificationPermission}
            >
              Enable Browser Notifications
            </Button>
          </Box>

          <Divider />

          {/* Notifications List */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Notifications sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You'll see real-time updates here
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.slice(0, 10).map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 0.5,
                        opacity: notification.read ? 0.7 : 1,
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: getNotificationColor(notification.type) + '.main',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < Math.min(notifications.length - 1, 9) && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {notifications.length > 10 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                size="small"
                onClick={() => {
                  navigate('/notifications');
                  handleClose();
                }}
              >
                View All Notifications
              </Button>
            </Box>
          )}
        </Box>
      </Popover>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}