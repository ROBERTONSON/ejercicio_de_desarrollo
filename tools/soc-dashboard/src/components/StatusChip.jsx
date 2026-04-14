import React from 'react';
import { getStatusClass, getStatusDotClass, capitalize } from '../lib/utils';

export function StatusChip({ status, className = '' }) {
  const statusClass = getStatusClass(status);
  const dotClass = getStatusDotClass(status);
  
  return (
    <span className={`status-chip ${statusClass} ${className}`}>
      <span className={`status-dot ${dotClass}`}></span>
      {capitalize(status)}
    </span>
  );
}
