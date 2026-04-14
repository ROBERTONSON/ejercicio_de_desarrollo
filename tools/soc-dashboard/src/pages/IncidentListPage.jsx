import React, { useState, useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { IncidentTable } from '../components/IncidentTable';
import { Can } from '../components/Can';
import { useAuth } from '../contexts/AuthContext';

export default function IncidentListPage() {
  const { incidents } = useIncidents();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [analystFilter, setAnalystFilter] = useState('all');
  const { users } = useAuth();

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => {
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
      })
      // Sorting is now handled by IncidentTable component
      // .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
          <select 
            className="input w-36" 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            aria-label="Filter by Severity"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            className="input w-36" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select 
            className="input w-36" 
            value={analystFilter} 
            onChange={(e) => setAnalystFilter(e.target.value)}
            aria-label="Filter by Analyst"
          >
            <option value="all">All Analysts</option>
            <option value="unassigned">Unassigned</option>
            {users.filter(u => u.role !== 'viewer').map(u => (
               <option key={u.id} value={u.id}>{u.displayName}</option>
            ))}
          </select>
        </div>

        <Can perform="create_incident">
          <button className="btn btn-primary w-full md:w-auto shrink-0 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Incident
          </button>
        </Can>
      </div>

      <IncidentTable incidents={filteredIncidents} />

    </div>
  );
}
