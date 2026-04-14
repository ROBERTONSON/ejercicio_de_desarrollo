// RBAC Permission System
// Implements Behavioral Rule #7: Jerarquía de Roles

const ROLE_HIERARCHY = {
  viewer: 0,
  analyst: 1,
  admin: 2,
};

/**
 * Permission definitions — maps actions to requirements
 */
const PERMISSIONS = {
  view_dashboard: { minRole: 'viewer' },
  view_incidents: { minRole: 'viewer' },
  view_incident_detail: { minRole: 'viewer' },
  create_incident: { minRole: 'analyst' },
  change_status: { minRole: 'analyst', requiresAssignment: true },
  change_severity: { minRole: 'analyst', requiresAssignment: true },
  assign_incident: { minRole: 'analyst' },
  add_note: { minRole: 'analyst', requiresAssignment: true },
  override_lock: { minRole: 'admin' },
  delete_incident: { minRole: 'admin' },
};

/**
 * Check if a role meets the minimum role requirement
 */
export function hasMinRole(userRole, requiredRole) {
  return (ROLE_HIERARCHY[userRole] ?? -1) >= (ROLE_HIERARCHY[requiredRole] ?? 99);
}

/**
 * Check if user can perform an action on an incident
 * @param {object} user - Current user { id, role }
 * @param {string} action - Action key from PERMISSIONS
 * @param {object} incident - Incident object (optional, for assignment checks)
 * @returns {boolean}
 */
export function canPerform(user, action, incident = null) {
  if (!user || !action) return false;

  const permission = PERMISSIONS[action];
  if (!permission) return false;

  // Admin can always do everything
  if (user.role === 'admin') return true;

  // Check minimum role
  if (!hasMinRole(user.role, permission.minRole)) return false;

  // Check assignment requirement (analyst on non-assigned incidents)
  if (permission.requiresAssignment && incident) {
    if (user.role === 'analyst' && incident.assigneeId !== user.id) {
      return false;
    }
  }

  return true;
}

/**
 * Check if user can edit an incident (considering role + lock state)
 * @param {object} user - Current user
 * @param {object} incident - Incident object
 * @returns {{ canEdit: boolean, reason: string }}
 */
export function canEditIncident(user, incident) {
  if (!user || !incident) {
    return { canEdit: false, reason: 'Missing user or incident data' };
  }

  // Viewer can never edit
  if (user.role === 'viewer') {
    return { canEdit: false, reason: 'Viewers have read-only access' };
  }

  // Check lock — Behavioral Rule #6: Exclusividad de Acción
  if (incident.lockedBy && incident.lockedBy !== user.id) {
    if (user.role === 'admin') {
      // Admin can override locks
      return { canEdit: true, reason: 'Admin override available' };
    }
    return { canEdit: false, reason: 'Incident is locked by another user' };
  }

  // Analyst can only edit assigned incidents or unassigned incidents (to claim them)
  if (user.role === 'analyst' && incident.assigneeId !== user.id && incident.assigneeId !== null) {
    return { canEdit: false, reason: 'Not assigned to this incident' };
  }

  return { canEdit: true, reason: '' };
}

/**
 * Get role display info
 */
export function getRoleInfo(role) {
  const info = {
    admin: { label: 'Admin', color: '#4D33DE', icon: '🛡️' },
    analyst: { label: 'Analyst', color: '#f97316', icon: '🔍' },
    viewer: { label: 'Viewer', color: '#6b7280', icon: '👁️' },
  };
  return info[role] || { label: role, color: '#6b7280', icon: '👤' };
}
