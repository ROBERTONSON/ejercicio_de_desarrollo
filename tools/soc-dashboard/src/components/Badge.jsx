import React from 'react';
import { getSeverityClass } from '../lib/utils';

export function Badge({ severity, className = '' }) {
  const severityClass = getSeverityClass(severity);
  
  return (
    <span className={`badge ${severityClass} ${className}`}>
      {severity}
    </span>
  );
}
