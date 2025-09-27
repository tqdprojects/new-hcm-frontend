import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().accessToken;
        const tenant = useAuthStore.getState().tenant;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (tenant?._id) {
          config.headers['X-Tenant-ID'] = tenant._id;
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Add timestamp for monitoring
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful requests in development
        if (import.meta.env.DEV) {
          const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle network errors
        if (!error.response) {
          useNotificationStore.getState().addNotification({
            title: 'Network Error',
            message: 'Unable to connect to server. Please check your internet connection.',
            type: 'error'
          });
          return Promise.reject(error);
        }

        // Handle token expiry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await useAuthStore.getState().refreshAccessToken();
            const newToken = useAuthStore.getState().accessToken;
            
            // Process queued requests
            this.processQueue(null, newToken);
            
            // Retry original request
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other HTTP errors
        this.handleHttpError(error);
        
        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private handleHttpError(error: AxiosError) {
    const { addNotification } = useNotificationStore.getState();
    
    switch (error.response?.status) {
      case 400:
        addNotification({
          title: 'Invalid Request',
          message: 'Please check your input and try again.',
          type: 'error'
        });
        break;
      case 403:
        addNotification({
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          type: 'error'
        });
        break;
      case 404:
        addNotification({
          title: 'Not Found',
          message: 'The requested resource was not found.',
          type: 'error'
        });
        break;
      case 429:
        addNotification({
          title: 'Rate Limited',
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'warning'
        });
        break;
      case 500:
        addNotification({
          title: 'Server Error',
          message: 'An unexpected server error occurred. Please try again later.',
          type: 'error'
        });
        break;
      default:
        if (import.meta.env.DEV) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`, error.response?.data);
        }
    }
  }

  // HTTP Methods with enhanced error handling
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  // File upload with progress and retry
  async uploadFile(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    retries: number = 3
  ): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await this.instance.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          },
          timeout: 60000, // 60 seconds for file uploads
        });
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.warn(`Upload attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('Upload failed after all retries');
  }

  // Batch requests
  async batch(requests: Array<() => Promise<any>>): Promise<any[]> {
    return Promise.allSettled(requests.map(request => request()));
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();

// Extend axios config type
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    _retry?: boolean;
  }
}