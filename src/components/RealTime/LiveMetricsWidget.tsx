import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useSocket } from '../../providers/SocketProvider';
import { useDynamicData } from '../../hooks/useDynamicData';

interface MetricData {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'percentage';
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: number[];
  target?: number;
  unit?: string;
}

interface LiveMetricsWidgetProps {
  module: string;
  metrics: string[];
  refreshInterval?: number;
}

export default function LiveMetricsWidget({
  module,
  metrics,
  refreshInterval = 30000,
}: LiveMetricsWidgetProps) {
  const { isConnected, on, off } = useSocket();
  const [liveMetrics, setLiveMetrics] = useState<Record<string, any>>({});

  // Fetch initial metrics
  const { data: metricsData, refetch } = useDynamicData({
    endpoint: `/analytics/${module}/metrics`,
    queryKey: ['live-metrics', module],
    params: { metrics: metrics.join(',') },
    refetchInterval,
  });

  // Set up real-time metric updates
  useEffect(() => {
    if (!isConnected) return;

    const handleMetricUpdate = (data: any) => {
      console.log(`📊 Live metric update [${module}]:`, data);
      setLiveMetrics(prev => ({
        ...prev,
        [data.metric]: data.value,
      }));
    };

    on(`metrics:${module}:update`, handleMetricUpdate);
    on('metrics:global:update', handleMetricUpdate);

    return () => {
      off(`metrics:${module}:update`, handleMetricUpdate);
      off('metrics:global:update', handleMetricUpdate);
    };
  }, [module, isConnected, on, off]);

  const getMetricIcon = (metric: string) => {
    const iconMap: Record<string, React.ComponentType> = {
      employees: People,
      revenue: AttachMoney,
      attendance: CheckCircle,
      performance: TrendingUp,
      satisfaction: CheckCircle,
      productivity: TrendingUp,
      costs: AttachMoney,
      efficiency: TrendingUp,
    };
    
    return iconMap[metric] || TrendingUp;
  };

  const getMetricColor = (metric: string): MetricData['color'] => {
    const colorMap: Record<string, MetricData['color']> = {
      employees: 'primary',
      revenue: 'success',
      attendance: 'info',
      performance: 'secondary',
      satisfaction: 'success',
      productivity: 'warning',
      costs: 'error',
      efficiency: 'info',
    };
    
    return colorMap[metric] || 'primary';
  };

  const formatValue = (value: any, metric: string) => {
    if (typeof value === 'number') {
      if (metric.includes('rate') || metric.includes('percentage')) {
        return `${value.toFixed(1)}%`;
      }
      if (metric.includes('cost') || metric.includes('revenue')) {
        return `$${value.toLocaleString()}`;
      }
      if (metric.includes('time') || metric.includes('duration')) {
        return `${value}h`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const renderMetricCard = (metric: string, data: any) => {
    const Icon = getMetricIcon(metric);
    const color = getMetricColor(metric);
    const currentValue = liveMetrics[metric] ?? data?.value ?? 0;
    const change = data?.change ?? 0;
    const target = data?.target;

    return (
      <Card key={metric}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                {data?.title || metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Typography>
              
              <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                {formatValue(currentValue, metric)}
              </Typography>
              
              {change !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {change > 0 ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : change < 0 ? (
                    <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  ) : null}
                  <Typography
                    variant="body2"
                    sx={{
                      color: change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {change > 0 ? '+' : ''}{change}% from last period
                  </Typography>
                </Box>
              )}

              {target && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress to target
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((currentValue / target) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((currentValue / target) * 100, 100)}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              )}
            </Box>

            <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
              <Icon sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>

          {/* Real-time indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: isConnected ? 'success.main' : 'error.main',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {isConnected ? 'Live data' : 'Offline'}
            </Typography>
            {data?.lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                • Updated {new Date(data.lastUpdated).toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (!metricsData?.data) {
    return (
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading {metric}...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={3} key={metric}>
          {renderMetricCard(metric, metricsData.data[metric])}
        </Grid>
      ))}
    </Grid>
  );
}