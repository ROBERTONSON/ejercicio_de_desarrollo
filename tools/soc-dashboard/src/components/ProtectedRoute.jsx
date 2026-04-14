import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

export function ProtectedRoute({ children, requiredAction = null }) {
  const { isAuthenticated } = useAuth();
  const { canPerform } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredAction && !canPerform(requiredAction)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
