import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UnauthRouter from './UnauthRouter';
import AuthRouter from './AuthRouter';
import { logout } from '../store/slices/authSlice';

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <UnauthRouter />;
  }

  return <AuthRouter userRole={role} onLogout={handleLogout} />;
}
