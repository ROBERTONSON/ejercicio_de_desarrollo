import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../lib/utils';
import { Badge } from './Badge';
import { StatusChip } from './StatusChip';
import { useAuth } from '../contexts/AuthContext';

export function IncidentTable({ incidents }) {
  const navigate = useNavigate();
  const { users } = useAuth();
  
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAssigneeName = (id) => {
    if (!id) return 'Unassigned';
    const u = users.find(user => user.id === id);
    return u ? u.displayName : id;
  };

  const sortedIncidents = useMemo(() => {
    if (!incidents) return [];
    
    return [...incidents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle specific fields
      if (sortField === 'assigneeId') {
        valA = getAssigneeName(a.assigneeId).toLowerCase();
        valB = getAssigneeName(b.assigneeId).toLowerCase();
      } else if (sortField === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortField === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        valA = severityOrder[a.severity] || 0;
        valB = severityOrder[b.severity] || 0;
      } else if (sortField === 'status') {
        const statusOrder = { open: 1, investigating: 2, escalated: 3, resolved: 4, closed: 5 };
        valA = statusOrder[a.status] || 0;
        valB = statusOrder[b.status] || 0;
      } else if (sortField === 'id') {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [incidents, sortField, sortDirection, users]);

  if (!incidents || incidents.length === 0) {
    return (
      <div className="p-8 text-center text-[#9898a8] bg-[#1a1a24] rounded-lg border border-[#2a2a3a]">
        No incidents found matching the current criteria.
      </div>
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="ml-1 opacity-20">↕</span>;
    return <span className="ml-1 text-[#60a5fa]">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[#2a2a3a] bg-[#13131d]">
      <table className="data-table w-full">
        <thead className="bg-[#1a1a24] cursor-pointer select-none">
          <tr>
            <th className="w-20" onClick={() => handleSort('id')}>
              ID <SortIcon field="id" />
            </th>
            <th className="min-w-[200px]" onClick={() => handleSort('title')}>
              Título <SortIcon field="title" />
            </th>
            <th className="w-32" onClick={() => handleSort('severity')}>
              Severidad <SortIcon field="severity" />
            </th>
            <th className="w-32" onClick={() => handleSort('status')}>
              Estado <SortIcon field="status" />
            </th>
            <th className="w-40" onClick={() => handleSort('assigneeId')}>
              Analista asignado <SortIcon field="assigneeId" />
            </th>
            <th className="w-32" onClick={() => handleSort('createdAt')}>
              Fecha de creación <SortIcon field="createdAt" />
            </th>
            <th className="w-32" onClick={() => handleSort('updatedAt')}>
              Última actualización <SortIcon field="updatedAt" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a3a]">
          {sortedIncidents.map((inc) => (
            <tr 
              key={inc.id} 
              onClick={() => navigate(`/incidents/${inc.id}`)}
              className="group hover:bg-[#1a1a24] cursor-pointer"
            >
              <td className="font-mono text-xs text-[#9898a8] whitespace-nowrap">{inc.id.split('-')[1]}</td>
              <td>
                <div className="font-medium text-white group-hover:text-[#60a5fa] transition-colors truncate max-w-xs" title={inc.title}>
                  {inc.title}
                </div>
              </td>
              <td>
                <Badge severity={inc.severity} />
              </td>
              <td>
                <StatusChip status={inc.status} />
              </td>
              <td className="text-sm">
                <div className="flex items-center gap-2">
                  {inc.assigneeId ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-[#2a2a3a] flex items-center justify-center text-[10px] flex-shrink-0">
                        {users.find(u => u.id === inc.assigneeId)?.displayName.charAt(0) || '?'}
                      </div>
                      <span className="truncate">{getAssigneeName(inc.assigneeId)}</span>
                    </>
                  ) : (
                    <span className="text-[#6a6a7a]">Unassigned</span>
                  )}
                </div>
              </td>
              <td className="text-sm text-[#9898a8] whitespace-nowrap">
                {formatDateTime(inc.createdAt)}
              </td>
              <td className="text-sm text-[#9898a8] whitespace-nowrap">
                {formatDateTime(inc.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
