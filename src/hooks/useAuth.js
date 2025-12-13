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
      
      dispatch(setCredentials({
        token: data.accessToken || data.token,
        user: data.user,
        role: data.user?.role || data.role,
      }));
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
