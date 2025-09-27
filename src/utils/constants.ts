// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
};

// Application Constants
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'VibhoHCM',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  COMPANY: import.meta.env.VITE_COMPANY_NAME || 'Vibho Technologies',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
};

// Performance Management Constants
export const PERFORMANCE = {
  RATING_SCALE: {
    MIN: 1,
    MAX: 5,
    LABELS: [
      { value: 1, label: 'Unsatisfactory', description: 'Performance significantly below expectations' },
      { value: 2, label: 'Below Expectations', description: 'Performance below expected standards' },
      { value: 3, label: 'Meets Expectations', description: 'Performance meets expected standards' },
      { value: 4, label: 'Exceeds Expectations', description: 'Performance exceeds expected standards' },
      { value: 5, label: 'Exceptional', description: 'Performance significantly exceeds expectations' },
    ],
  },
  GOAL_CATEGORIES: [
    { value: 'customer-service', label: 'Customer Service' },
    { value: 'professional-development', label: 'Professional Development' },
    { value: 'project-management', label: 'Project Management' },
    { value: 'sales-revenue', label: 'Sales & Revenue' },
    { value: 'quality-process', label: 'Quality & Process' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'collaboration', label: 'Collaboration' },
  ],
  PRIORITIES: [
    { value: 'low', label: 'Low', color: 'info' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'critical', label: 'Critical', color: 'error' },
  ],
  COMPETENCIES: [
    { id: 'technical', name: 'Technical Skills', weight: 25 },
    { id: 'communication', name: 'Communication', weight: 20 },
    { id: 'problem-solving', name: 'Problem Solving', weight: 25 },
    { id: 'collaboration', name: 'Collaboration', weight: 20 },
    { id: 'initiative', name: 'Initiative', weight: 10 },
  ],
};

// Status Colors
export const STATUS_COLORS = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  default: '#9e9e9e',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vibho-hcm-auth',
  USER_PREFERENCES: 'vibho-hcm-preferences',
  THEME: 'vibho-hcm-theme',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/,
  },
  EMAIL: {
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SUBMITTED: 'Submitted successfully',
  APPROVED: 'Approved successfully',
  REJECTED: 'Rejected successfully',
};