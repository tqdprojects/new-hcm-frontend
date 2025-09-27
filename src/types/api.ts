// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Re-export for backward compatibility
export type ApiResponse<T = any> = IApiResponse<T>;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: string;
  details?: ValidationError[];
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Request Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}