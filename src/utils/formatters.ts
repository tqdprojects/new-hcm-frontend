import { format, formatDistanceToNow, isValid } from 'date-fns';

// Date formatting utilities
export const formatDate = (date: Date | string | null | undefined, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return '-';
  
  return format(dateObj, formatStr);
};

export const formatDateTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, 'HH:mm');
};

export const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return '-';
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Number formatting utilities
export const formatCurrency = (amount: number | null | undefined, currency: string = 'USD'): string => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number | null | undefined, decimals: number = 0): string => {
  if (num === null || num === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined) return '-';
  
  return `${formatNumber(value, decimals)}%`;
};

// Text formatting utilities
export const truncateText = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (text: string | null | undefined): string => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatName = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  return `${first} ${last}`.trim() || 'Unknown';
};

// Status formatting utilities
export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  const statusLower = status.toLowerCase();
  
  if (['active', 'approved', 'completed', 'success', 'present', 'on-track'].includes(statusLower)) {
    return 'success';
  }
  
  if (['pending', 'submitted', 'warning', 'late', 'at-risk'].includes(statusLower)) {
    return 'warning';
  }
  
  if (['rejected', 'failed', 'error', 'absent', 'overdue', 'terminated'].includes(statusLower)) {
    return 'error';
  }
  
  if (['draft', 'scheduled', 'info', 'work-from-home'].includes(statusLower)) {
    return 'info';
  }
  
  return 'default';
};

export const formatStatus = (status: string): string => {
  return status
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

// File size formatting
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Duration formatting
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  return `${mins}m`;
};

// Phone number formatting
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Goal progress formatting
export const formatGoalProgress = (progress: number | null | undefined): string => {
  if (progress === null || progress === undefined) return '0%';
  
  return `${Math.round(progress)}%`;
};

export const getProgressColor = (progress: number): 'success' | 'warning' | 'error' => {
  if (progress >= 80) return 'success';
  if (progress >= 60) return 'warning';
  return 'error';
};

// Rating formatting
export const formatRating = (rating: number | null | undefined, maxRating: number = 5): string => {
  if (rating === null || rating === undefined) return '-';
  
  return `${rating.toFixed(1)}/${maxRating}`;
};

export const getRatingColor = (rating: number, maxRating: number = 5): 'success' | 'warning' | 'error' | 'info' => {
  const percentage = (rating / maxRating) * 100;
  
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 40) return 'warning';
  return 'error';
};