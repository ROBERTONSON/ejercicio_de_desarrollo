// IncidentContext — Manages incident state with CRUD + Locking
// Behavioral Rule #6: Exclusividad de Acción (record locking)
// Behavioral Rule #9: Auto-generates audit entries on mutations

import { createContext, useContext, useState, useCallback } from 'react';
import { incidents as seedIncidents } from '../data/mockData';
import { generateId } from '../lib/utils';
import { sanitize } from '../lib/sanitize';
import { useAudit } from './AuditContext';

const IncidentContext = createContext(null);

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(seedIncidents);
  const { addEntry } = useAudit();

  // Get a single incident by ID
  const getIncident = useCallback((id) => {
    return incidents.find(inc => inc.id === id) || null;
  }, [incidents]);

  // Create a new incident
  const createIncident = useCallback((data, actorId) => {
    const now = new Date().toISOString();
    const newIncident = {
      id: generateId('inc'),
      title: sanitize(data.title),
      description: sanitize(data.description),
      severity: data.severity || 'medium',
      status: 'open',
      assigneeId: data.assigneeId || null,
      reportedBy: actorId,
      createdAt: now,
      updatedAt: now,
      lockedBy: null,
      lockedAt: null,
      tags: data.tags || [],
      affectedSystems: data.affectedSystems || [],
      notes: [],
    };

    setIncidents(prev => [newIncident, ...prev]);

    addEntry({
      incidentId: newIncident.id,
      actorId,
      action: 'incident_created',
      previousValue: null,
      newValue: newIncident.title,
      metadata: { severity: newIncident.severity },
    });

    return newIncident;
  }, [addEntry]);

  // Update incident status
  const updateStatus = useCallback((incidentId, newStatus, actorId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const previousValue = inc.status;
      addEntry({
        incidentId,
        actorId,
        action: 'status_change',
        previousValue,
        newValue: newStatus,
        metadata: {},
      });
      return { ...inc, status: newStatus, updatedAt: new Date().toISOString() };
    }));
  }, [addEntry]);

  // Update incident severity
  const updateSeverity = useCallback((incidentId, newSeverity, actorId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const previousValue = inc.severity;
      addEntry({
        incidentId,
        actorId,
        action: 'severity_change',
        previousValue,
        newValue: newSeverity,
        metadata: {},
      });
      return { ...inc, severity: newSeverity, updatedAt: new Date().toISOString() };
    }));
  }, [addEntry]);

  // Assign incident
  const assignIncident = useCallback((incidentId, assigneeId, actorId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const previousValue = inc.assigneeId;
      addEntry({
        incidentId,
        actorId,
        action: 'assignment_change',
        previousValue,
        newValue: assigneeId,
        metadata: {},
      });
      return { ...inc, assigneeId, updatedAt: new Date().toISOString() };
    }));
  }, [addEntry]);

  // Add note to incident
  const addNote = useCallback((incidentId, content, actorId) => {
    const sanitizedContent = sanitize(content);
    const noteId = generateId('note');
    const now = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const newNote = {
        id: noteId,
        authorId: actorId,
        content: sanitizedContent,
        createdAt: now,
      };
      addEntry({
        incidentId,
        actorId,
        action: 'note_added',
        previousValue: null,
        newValue: sanitizedContent.substring(0, 80),
        metadata: { noteId },
      });
      return {
        ...inc,
        notes: [...inc.notes, newNote],
        updatedAt: now,
      };
    }));
  }, [addEntry]);

  // Acquire lock on incident
  const acquireLock = useCallback((incidentId, actorId) => {
    const now = new Date().toISOString();
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      // Check if already locked by someone else
      if (inc.lockedBy && inc.lockedBy !== actorId) return inc;
      addEntry({
        incidentId,
        actorId,
        action: 'lock_acquired',
        previousValue: null,
        newValue: actorId,
        metadata: {},
      });
      return { ...inc, lockedBy: actorId, lockedAt: now };
    }));
  }, [addEntry]);

  // Release lock
  const releaseLock = useCallback((incidentId, actorId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      addEntry({
        incidentId,
        actorId,
        action: 'lock_released',
        previousValue: actorId,
        newValue: null,
        metadata: {},
      });
      return { ...inc, lockedBy: null, lockedAt: null };
    }));
  }, [addEntry]);

  // Force release lock (admin override)
  const forceReleaseLock = useCallback((incidentId, actorId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const prevLockHolder = inc.lockedBy;
      addEntry({
        incidentId,
        actorId,
        action: 'lock_released',
        previousValue: prevLockHolder,
        newValue: null,
        metadata: { adminOverride: true },
      });
      return { ...inc, lockedBy: null, lockedAt: null };
    }));
  }, [addEntry]);

  // Delete incident
  const deleteIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.filter(inc => inc.id !== incidentId));
  }, []);

  const value = {
    incidents,
    getIncident,
    createIncident,
    updateStatus,
    updateSeverity,
    assignIncident,
    addNote,
    acquireLock,
    releaseLock,
    forceReleaseLock,
    deleteIncident,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}

export default IncidentContext;
