import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useIncidents } from '../contexts/IncidentContext';
import { useAudit } from '../contexts/AuditContext';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { Badge } from '../components/Badge';
import { StatusChip } from '../components/StatusChip';
import { formatDateTime, formatDate, getActionLabel, capitalize } from '../lib/utils';
import { sanitizeRich } from '../lib/sanitize';
import { Can } from '../components/Can';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const { getIncident, updateStatus, updateSeverity, assignIncident, addNote, acquireLock, releaseLock, forceReleaseLock, deleteIncident } = useIncidents();
  const { getEntriesForIncident } = useAudit();
  const { currentUser, users } = useAuth();
  const { canEditIncident, isAdmin } = usePermissions();
  
  const incident = getIncident(id);
  const auditEntries = getEntriesForIncident(id);
  
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();
  
  if (!incident) {
    return <Navigate to="/404" replace />;
  }

  // Determine edit state based on RBAC + current lock
  const { canEdit, reason: editReason } = canEditIncident(incident);
  const isLockedByMe = incident.lockedBy === currentUser.id;

  const handleStatusChange = (e) => updateStatus(incident.id, e.target.value, currentUser.id);
  const handleSeverityChange = (e) => updateSeverity(incident.id, e.target.value, currentUser.id);
  const handleAssigneeChange = (e) => assignIncident(incident.id, e.target.value || null, currentUser.id);
  
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(incident.id, newNote, currentUser.id);
    setNewNote('');
  };

  const getUserName = (userId) => {
    return users.find(u => u.id === userId)?.displayName || 'System';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      deleteIncident(incident.id);
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between card bg-[#13131d] border-[#2a2a3a]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-[#9898a8]">#{incident.id.split('-')[1]}</span>
            <Badge severity={incident.severity} />
            <StatusChip status={incident.status} />
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{incident.title}</h1>
        </div>
        
        {/* Lock Controls (Behavioral Rule #6) */}
        <div className="flex items-center gap-3 shrink-0">
          {incident.lockedBy && !isLockedByMe && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#eab308]/10 border border-[#eab308]/30 text-[#eab308] text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked by {getUserName(incident.lockedBy)}
            </div>
          )}
          
          {incident.lockedBy && !isLockedByMe && isAdmin && (
            <button onClick={() => forceReleaseLock(incident.id, currentUser.id)} className="btn btn-sm btn-danger px-3 py-1.5" title="Admin Override">
              Force Unlock
            </button>
          )}

          {isLockedByMe && (
            <button onClick={() => releaseLock(incident.id, currentUser.id)} className="btn btn-sm text-[#eab308] border-[#eab308]/50 hover:bg-[#eab308]/10 flex gap-2 items-center px-3 py-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Release Edit Lock
            </button>
          )}

          {!incident.lockedBy && (currentUser.role !== 'viewer') && (
            <button onClick={() => acquireLock(incident.id, currentUser.id)} className="btn btn-sm border-[#4D33DE] text-[#4D33DE] hover:bg-[#4D33DE]/10 flex gap-2 items-center px-3 py-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Acquire Edit Lock
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <div 
              className="prose prose-invert max-w-none text-sm text-[#e8e8ed] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeRich(incident.description) }}
            />
            
            {(incident.tags.length > 0 || incident.affectedSystems.length > 0) && (
              <div className="mt-6 flex flex-col gap-4 border-t border-[#2a2a3a] pt-4">
                {incident.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-[#6a6a7a] mt-1 mr-2">TAGS</span>
                    {incident.tags.map(t => (
                      <span key={t} className="px-2 py-1 rounded bg-[#1a1a24] border border-[#2a2a3a] text-xs text-[#9898a8]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {incident.affectedSystems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-[#6a6a7a] mt-1 mr-2">SYSTEMS</span>
                    {incident.affectedSystems.map(s => (
                      <span key={s} className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="card flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Investigation Notes</h3>
            
            <div className="flex flex-col gap-4">
              {incident.notes.map(note => (
                <div key={note.id} className="p-4 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-[#e8e8ed]">{getUserName(note.authorId)}</div>
                    <div className="text-xs text-[#6a6a7a]">{formatDateTime(note.createdAt)}</div>
                  </div>
                  <div 
                    className="text-sm text-[#9898a8] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: note.content }} 
                  />
                </div>
              ))}
              {incident.notes.length === 0 && (
                <div className="text-sm text-[#6a6a7a] italic">No notes added yet.</div>
              )}
            </div>

            <Can perform="add_note" incident={incident}>
              <div className="pt-4 border-t border-[#2a2a3a] mt-2">
                {!canEdit ? (
                  <div className="text-sm text-[#eab308] bg-[#eab308]/10 p-3 rounded-md border border-[#eab308]/20 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Cannot add notes: {editReason}
                  </div>
                ) : (
                  <form onSubmit={handleAddNote} className="flex flex-col gap-3">
                    <textarea 
                      className="input min-h-[100px] text-sm" 
                      placeholder="Add an investigation note... (bold, italic tags allowed)"
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button type="submit" disabled={!newNote.trim()} className="btn btn-primary text-sm">
                        Add Note
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Can>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          
          {/* Metadata & Actions */}
          <div className="card flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-white">Properties</h3>
            
            <div className="flex flex-col gap-4">
              
              <div className="pt-2 pb-4 border-b border-[#2a2a3a]">
                <label className="text-xs text-[#6a6a7a] block mb-2">Quick Actions</label>
                <div className="flex flex-wrap gap-2">
                  <Can perform="change_status" incident={incident}>
                    <button onClick={() => updateStatus(incident.id, 'escalated', currentUser.id)} disabled={!canEdit} className="btn btn-sm border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10">Escalar</button>
                    <button onClick={() => updateStatus(incident.id, 'resolved', currentUser.id)} disabled={!canEdit} className="btn btn-sm border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10">Resolver</button>
                    <button onClick={() => updateStatus(incident.id, 'closed', currentUser.id)} disabled={!canEdit} className="btn btn-sm border-[#6a6a7a] text-[#9898a8] hover:bg-[#2a2a3a]">Cerrar</button>
                  </Can>
                  <Can perform="assign_incident" incident={incident}>
                    <button onClick={() => assignIncident(incident.id, currentUser.id, currentUser.id)} disabled={!canEdit} className="btn btn-sm border-[#4D33DE] text-[#4D33DE] hover:bg-[#4D33DE]/10">Asignar a mí</button>
                  </Can>
                  <Can perform="delete_incident" incident={incident}>
                     <button onClick={handleDelete} className="btn btn-sm btn-danger ml-auto">Eliminar</button>
                  </Can>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6a6a7a] block mb-1">Status</label>
                <Can 
                  perform="change_status" 
                  incident={incident} 
                  fallback={<StatusChip status={incident.status} className="w-full justify-center py-1.5 border border-[#2a2a3a]" />}
                >
                  <select 
                    className="input py-1.5 focus:border-[#4D33DE]" 
                    value={incident.status}
                    onChange={handleStatusChange}
                    disabled={!canEdit}
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="escalated">Escalated</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </Can>
              </div>

              <div>
                <label className="text-xs text-[#6a6a7a] block mb-1">Severity</label>
                <Can 
                  perform="change_severity" 
                  incident={incident}
                  fallback={<Badge severity={incident.severity} className="w-full justify-center py-1.5 border border-[#2a2a3a]" />}
                >
                  <select 
                    className="input py-1.5 focus:border-[#4D33DE]" 
                    value={incident.severity}
                    onChange={handleSeverityChange}
                    disabled={!canEdit}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </Can>
              </div>

              <div>
                <label className="text-xs text-[#6a6a7a] block mb-1">Assignee</label>
                <Can 
                  perform="assign_incident" 
                  incident={incident}
                  fallback={<div className="text-sm font-medium text-white p-2 rounded bg-[#1a1a24] border border-[#2a2a3a]">{getUserName(incident.assigneeId)}</div>}
                >
                  <select 
                    className="input py-1.5 focus:border-[#4D33DE]" 
                    value={incident.assigneeId || ''}
                    onChange={handleAssigneeChange}
                    disabled={!canEdit}
                  >
                    <option value="">-- Unassigned --</option>
                    {users.filter(u => u.role !== 'viewer').map(u => (
                      <option key={u.id} value={u.id}>{u.displayName} ({capitalize(u.role)})</option>
                    ))}
                  </select>
                </Can>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2a2a3a] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#6a6a7a]">Created</span>
                <span className="text-[#9898a8]">{formatDate(incident.createdAt)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6a6a7a]">Reported By</span>
                <span className="text-[#9898a8]">{getUserName(incident.reportedBy)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6a6a7a]">Last Updated</span>
                <span className="text-[#9898a8]">{formatDateTime(incident.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="card flex flex-col h-full min-h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-4">Audit Trail</h3>
            <div className="text-xs text-[#6a6a7a] mb-4 pb-2 border-b border-[#2a2a3a]">
              Immutable log of all actions.
            </div>
            
            <div className="flex-1 flex flex-col gap-0 overflow-y-auto pr-2 relative" style={{maxHeight: '400px'}}>
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#2a2a3a]"></div>
              
              {auditEntries.map((entry, idx) => (
                <div key={entry.id} className="relative pl-8 py-3 group">
                   {/* Circle indicator */}
                   <div className="absolute left-2 top-4 w-2 h-2 rounded-full bg-[#1a1a24] border-2 border-[#60a5fa] ring-4 ring-[#13131d] group-hover:bg-[#60a5fa] transition-colors z-10"></div>
                   
                   <div className="flex justify-between items-start gap-2 mb-1">
                     <span className="text-xs font-semibold text-[#e8e8ed]">{getActionLabel(entry.action)}</span>
                     <span className="text-[10px] text-[#6a6a7a] whitespace-nowrap" title={formatDateTime(entry.timestamp)}>
                       {formatDateTime(entry.timestamp)}
                     </span>
                   </div>
                   
                   <div className="text-xs flex gap-1 items-center flex-wrap">
                      <span className="text-[#9898a8]">{getUserName(entry.actorId)}</span>
                      {entry.previousValue && entry.previousValue !== entry.newValue && (
                        <>
                          <span className="text-[#6a6a7a]">changed from</span>
                          <span className="line-through text-[#6a6a7a] bg-[#1a1a24] px-1 rounded">{String(entry.previousValue).substring(0,20)}</span>
                          <span className="text-[#6a6a7a]">to</span>
                        </>
                      )}
                      
                      {entry.newValue && (
                        <span className="text-white px-1 py-0.5 bg-[#2a2a3a] rounded whitespace-pre-wrap break-all">
                          {entry.action === 'assignment_change' ? getUserName(entry.newValue) : String(entry.newValue)}
                        </span>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
