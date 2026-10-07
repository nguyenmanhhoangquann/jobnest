import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from './ToastHost.jsx';

export default function ProtectedRoute({ allowedRole, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    showToast('error', 'Bạn không có quyền truy cập trang này!');
    return <Navigate to="/" replace />;
  }

  return children;
}
