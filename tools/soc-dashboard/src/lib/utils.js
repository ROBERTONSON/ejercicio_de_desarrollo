// Utility functions — shared across the application
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines tailwind CSS classes without style conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a simple UUID v4 for mock operations
 */
export function generateId(prefix = 'id') {
  const segment = () => Math.random().toString(36).substring(2, 8);
  return `${prefix}-${segment()}`;
}

/**
 * Format an ISO-8601 timestamp for display
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'MMM dd, yyyy');
  } catch {
    return isoString;
  }
}

/**
 * Format an ISO-8601 timestamp with time
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'MMM dd, yyyy HH:mm');
  } catch {
    return isoString;
  }
}

/**
 * Format as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return isoString;
  }
}

/**
 * Get initials from a display name
 */
export function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get human-readable action label for audit log entries
 */
export function getActionLabel(action) {
  const labels = {
    status_change: 'Status Changed',
    assignment_change: 'Assignee Changed',
    note_added: 'Note Added',
    severity_change: 'Severity Changed',
    lock_acquired: 'Lock Acquired',
    lock_released: 'Lock Released',
    incident_created: 'Incident Created',
  };
  return labels[action] || action;
}

/**
 * Get CSS class for severity badge
 */
export function getSeverityClass(severity) {
  const classes = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };
  return classes[severity] || '';
}

/**
 * Get CSS class for status chip
 */
export function getStatusClass(status) {
  const classes = {
    open: 'status-open',
    investigating: 'status-investigating',
    contained: 'status-contained',
    resolved: 'status-resolved',
    closed: 'status-closed',
  };
  return classes[status] || '';
}

/**
 * Get CSS class for status dot
 */
export function getStatusDotClass(status) {
  const classes = {
    open: 'status-dot-open',
    investigating: 'status-dot-investigating',
    contained: 'status-dot-contained',
    resolved: 'status-dot-resolved',
    closed: 'status-dot-closed',
  };
  return classes[status] || '';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Compute MTTR (Mean Time to Resolve) in hours
 */
export function computeMTTR(incidents) {
  const resolved = incidents.filter(
    inc => inc.status === 'resolved' || inc.status === 'closed'
  );
  if (resolved.length === 0) return 0;

  const totalHours = resolved.reduce((sum, inc) => {
    const created = parseISO(inc.createdAt).getTime();
    const updated = parseISO(inc.updatedAt).getTime();
    return sum + (updated - created) / (1000 * 60 * 60);
  }, 0);

  return Math.round((totalHours / resolved.length) * 10) / 10;
}
