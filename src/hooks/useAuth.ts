import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ email, password, mfaToken }: { 
      email: string; 
      password: string; 
      mfaToken?: string; 
    }) => authApi.login(email, password, mfaToken),
    onSuccess: (response) => {
      if (response.requireMFA) {
        // Handle MFA requirement
        return;
      }

      setAuth({
        user: response.data.user,
        employee: response.data.employee,
        tenant: response.data.tenant,
        accessToken: response.data.tokens.accessToken,
        refreshToken: response.data.tokens.refreshToken,
      });

      addNotification({
        title: 'Login Successful',
        message: 'Welcome back to VibhoHCM!',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Login Failed',
        message: error.response?.data?.error || 'Invalid credentials',
        type: 'error'
      });
    }
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Force logout even if API call fails
      logout();
      queryClient.clear();
    }
  });
};

export const useProfile = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChangePassword = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { 
      currentPassword: string; 
      newPassword: string; 
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      addNotification({
        title: 'Password Changed',
        message: 'Your password has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Password Change Failed',
        message: error.response?.data?.error || 'Failed to change password',
        type: 'error'
      });
    }
  });
};