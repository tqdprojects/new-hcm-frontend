import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
} from '@mui/material';

interface Activity {
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface RecentActivityCardProps {
  title: string;
  activities: Activity[];
}

export default function RecentActivityCard({ title, activities }: RecentActivityCardProps) {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      case 'info':
      default:
        return 'info.main';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        
        <List sx={{ px: 0 }}>
          {activities.map((activity, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{
                    bgcolor: getActivityColor(activity.type),
                    width: 32,
                    height: 32,
                  }}
                >
                  <activity.icon sx={{ fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {activity.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {activities.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              No recent activity
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}