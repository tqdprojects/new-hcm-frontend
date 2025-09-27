import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Psychology,
  Info,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';

interface AIInsightCardProps {
  title: string;
  insight: string;
  confidence: number;
  type: 'success' | 'warning' | 'error' | 'info';
  features?: string[];
  modelVersion?: string;
  explanation?: string;
  recommendations?: string[];
  icon?: React.ComponentType;
}

export default function AIInsightCard({
  title,
  insight,
  confidence,
  type,
  features = [],
  modelVersion,
  explanation,
  recommendations = [],
  icon: Icon = Psychology,
}: AIInsightCardProps) {
  const [explainDialog, setExplainDialog] = useState(false);

  const getTypeColor = () => {
    switch (type) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      default: return 'info.main';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <TrendingUp />;
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${getTypeColor()}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: `0 20px 40px ${getTypeColor()}20`,
            borderColor: getTypeColor(),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: getTypeColor(),
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: getTypeColor(),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {title}
                </Typography>
                <Chip
                  icon={<Psychology />}
                  label="AI"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Tooltip title="View AI explanation">
                  <IconButton
                    size="small"
                    onClick={() => setExplainDialog(true)}
                  >
                    <Info />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {insight}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Confidence: {Math.round(confidence * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={confidence * 100}
                    color={getConfidenceColor() as any}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                {getTypeIcon()}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Explanation Dialog */}
      <Dialog
        open={explainDialog}
        onClose={() => setExplainDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            AI Insight Explanation
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {explanation || insight}
            </Typography>
          </Box>

          {features.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Features Analyzed:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Model Information:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Model Version: {modelVersion || 'v1.0.0'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {Math.round(confidence * 100)}%
            </Typography>
          </Box>

          {recommendations.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Recommendations:
              </Typography>
              <List dense>
                {recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExplainDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}