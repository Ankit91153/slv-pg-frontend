import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authService } from '../api/services/authService';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // Handle new response structure: response.data contains the actual data
      const data = response.data || response;
      
      console.log("🔐 Login Response:", {
        hasData: !!data,
        hasAccessToken: !!data.accessToken,
        hasToken: !!data.token,
        hasUser: !!data.user,
        userRole: data.user?.role,
      });
      
      const credentials = {
        token: data.accessToken || data.token,
        user: data.user,
        role: data.user?.role || data.role,
      };
      
      console.log("💾 Storing credentials:", {
        hasToken: !!credentials.token,
        token: credentials.token ? `${credentials.token.substring(0, 20)}...` : null,
        userName: credentials.user?.name,
        userRole: credentials.role,
      });
      
      dispatch(setCredentials(credentials));
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useVerifyOTP = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (data) => {
      if (data.token) {
        dispatch(setCredentials({
          token: data.token,
          user: data.user,
          role: data.role,
        }));
      }
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: authService.resendOTP,
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logoutAction());
    },
  });
};
