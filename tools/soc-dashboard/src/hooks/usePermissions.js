// Custom hook for RBAC permissions checking
import { useAuth } from '../contexts/AuthContext';
import { canPerform, canEditIncident } from '../lib/permissions';

export function usePermissions() {
  const { currentUser } = useAuth();

  const checkAction = (action, incident = null) => {
    return canPerform(currentUser, action, incident);
  };

  const checkEdit = (incident) => {
    return canEditIncident(currentUser, incident);
  };

  return {
    canPerform: checkAction,
    canEditIncident: checkEdit,
    role: currentUser?.role || 'guest',
    isAdmin: currentUser?.role === 'admin',
    isAnalyst: currentUser?.role === 'analyst',
    isViewer: currentUser?.role === 'viewer',
  };
}
