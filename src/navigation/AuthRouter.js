import React from 'react';
import TenantRouter from './TenantRouter';
import AdminRouter from './AdminRouter';
import { USER_ROLES } from '../constants/screens';

export default function AuthRouter({ userRole, onLogout }) {
  if (userRole === USER_ROLES.ADMIN) {
    return <AdminRouter onLogout={onLogout} />;
  }
  
  if (userRole === USER_ROLES.TENANT) {
    return <TenantRouter onLogout={onLogout} />;
  }
  
  return null;
}
