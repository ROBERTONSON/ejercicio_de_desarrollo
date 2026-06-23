import React, { useState, useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { IncidentTable } from '../components/IncidentTable';
import { Can } from '../components/Can';
import { useAuth } from '../contexts/AuthContext';

export default function IncidentListPage() {
  const { incidents, createIncident } = useIncidents();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [analystFilter, setAnalystFilter] = useState('all');
  const { users, currentUser } = useAuth();

  // Create incident modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState('medium');
  const [newAssigneeId, setNewAssigneeId] = useState('');

  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createIncident(
      {
        title: newTitle,
        description: newDescription,
        severity: newSeverity,
        assigneeId: newAssigneeId || null,
      },
      currentUser.id
    );
    // Reset and close
    setNewTitle('');
    setNewDescription('');
    setNewSeverity('medium');
    setNewAssigneeId('');
    setShowModal(false);
  };

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch =
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      let matchesAnalyst = true;
      if (analystFilter === 'unassigned') matchesAnalyst = !inc.assigneeId;
      else if (analystFilter !== 'all') matchesAnalyst = inc.assigneeId === analystFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesAnalyst;
    });
  }, [incidents, searchTerm, severityFilter, statusFilter, analystFilter]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search incidents, IDs, or tags..."
              className="input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <select className="input w-36" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} aria-label="Filter by Severity">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select className="input w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by Status">
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select className="input w-36" value={analystFilter} onChange={(e) => setAnalystFilter(e.target.value)} aria-label="Filter by Analyst">
            <option value="all">All Analysts</option>
            <option value="unassigned">Unassigned</option>
            {users.filter(u => u.role !== 'viewer').map(u => (
              <option key={u.id} value={u.id}>{u.displayName}</option>
            ))}
          </select>
        </div>

        <Can perform="create_incident">
          <button
            id="btn-new-incident"
            className="btn btn-primary w-full md:w-auto shrink-0 flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Incident
          </button>
        </Can>
      </div>

      <IncidentTable incidents={filteredIncidents} />

      {/* Create Incident Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="card w-full max-w-lg animate-scale-in" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">New Incident</h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-[#6a6a7a] mb-1">Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Brief description of the incident..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-[#6a6a7a] mb-1">Description</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Detailed description of what was detected..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#6a6a7a] mb-1">Severity</label>
                  <select className="input" value={newSeverity} onChange={e => setNewSeverity(e.target.value)}>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#6a6a7a] mb-1">Assign To</label>
                  <select className="input" value={newAssigneeId} onChange={e => setNewAssigneeId(e.target.value)}>
                    <option value="">-- Unassigned --</option>
                    {users.filter(u => u.role !== 'viewer').map(u => (
                      <option key={u.id} value={u.id}>{u.displayName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-[#2a2a3a] mt-2">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}>
                  Create Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
