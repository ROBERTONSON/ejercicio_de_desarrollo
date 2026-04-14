// UI Component: Role-based render guard
// Render children only if user has permission
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export function Can({ perform, incident = null, fallback = null, children }) {
  const { canPerform } = usePermissions();
  
  if (canPerform(perform, incident)) {
    return <>{children}</>;
  }
  
  return fallback;
}
