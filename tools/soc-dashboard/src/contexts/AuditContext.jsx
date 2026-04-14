// AuditContext — Append-only audit log
// Behavioral Rule #9: Persistencia de Auditoría
// The audit log is APPEND-ONLY — entries are never modified or deleted.

import { createContext, useContext, useState, useCallback } from 'react';
import { auditLog as seedAuditLog } from '../data/mockData';
import { generateId } from '../lib/utils';

const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [entries, setEntries] = useState(seedAuditLog);

  /**
   * Append a new entry to the audit log.
   * This is the ONLY mutation allowed — no update, no delete.
   */
  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: generateId('aud'),
      incidentId: entry.incidentId,
      actorId: entry.actorId,
      action: entry.action,
      previousValue: entry.previousValue ?? null,
      newValue: entry.newValue,
      timestamp: new Date().toISOString(),
      metadata: entry.metadata || {},
    };

    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  /**
   * Get audit entries for a specific incident, chronological order
   */
  const getEntriesForIncident = useCallback((incidentId) => {
    return entries
      .filter(e => e.incidentId === incidentId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [entries]);

  /**
   * Get the most recent audit entries (for dashboard recent activity)
   */
  const getRecentEntries = useCallback((count = 10) => {
    return [...entries]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, count);
  }, [entries]);

  const value = {
    entries,
    addEntry,
    getEntriesForIncident,
    getRecentEntries,
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}

export default AuditContext;
