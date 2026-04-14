import React, { useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { useAudit } from '../contexts/AuditContext';
import { useAuth } from '../contexts/AuthContext';
import { computeMTTR, formatRelativeTime } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { NumberTicker } from '../components/NumberTicker';
import { BorderBeam } from '../components/BorderBeam';
import { MagicButton } from '../components/MagicButton';
import { Meteors } from '../components/Meteors';

export default function DashboardPage() {
  const { incidents } = useIncidents();
  const { getRecentEntries } = useAudit();
  const { users } = useAuth();
  
  const recentAuditInfo = getRecentEntries(5);

  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  const escalatedIncidents = incidents.filter(i => i.status === 'escalated').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const resolvedToday = incidents.filter(i => 
    (i.status === 'resolved' || i.status === 'closed') && 
    i.updatedAt.startsWith(todayStr)
  ).length;

  const mttr = computeMTTR(incidents);

  // Group by severity
  const severityData = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    incidents.forEach(inc => { if (counts[inc.severity] !== undefined) counts[inc.severity]++; });
    return [
      { name: 'Critical', count: counts.critical, color: '#ef4444' },
      { name: 'High', count: counts.high, color: '#f97316' },
      { name: 'Medium', count: counts.medium, color: '#eab308' },
      { name: 'Low', count: counts.low, color: '#60a5fa' },
    ];
  }, [incidents]);

  // Top 3 analysts
  const topAnalysts = useMemo(() => {
    const counts = {};
    incidents.forEach(inc => {
      if ((inc.status === 'resolved' || inc.status === 'closed') && inc.assigneeId) {
        counts[inc.assigneeId] = (counts[inc.assigneeId] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .map(([userId, count]) => ({
        user: users.find(u => u.id === userId),
        count
      }))
      .filter(a => a.user)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [incidents, users]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      <div className="flex items-center justify-between relative">
        <h2 className="text-2xl font-bold text-white">Resumen Operativo</h2>
        <Link to="/incidents">
          <MagicButton icon={<span>⚡</span>}>Nuevo Incidente</MagicButton>
        </Link>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        
        <div className="card flex flex-col gap-2 relative overflow-hidden group hover:border-[#60a5fa]/50">
          <div className="absolute inset-0 bg-[#60a5fa]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-sm font-medium text-[#9898a8]">Incidentes Abiertos</div>
          <div className="text-3xl font-bold text-white"><NumberTicker value={openIncidents} /></div>
          <BorderBeam size={100} duration={8} delay={1} colorFrom="#4D33DE" colorTo="#60a5fa" />
        </div>
        
        <div className={`card flex flex-col gap-2 relative overflow-hidden group hover:border-[#f97316]/50 ${escalatedIncidents > 0 ? 'border-[#f97316]/30' : ''}`}>
          {escalatedIncidents > 0 && <Meteors number={10} />}
          <div className="absolute inset-0 bg-[#f97316]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-sm font-medium text-[#9898a8] flex items-center justify-between relative z-10">
            Incidentes Escalados
            {escalatedIncidents > 0 && <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span>}
          </div>
          <div className={`text-3xl font-bold relative z-10 ${escalatedIncidents > 0 ? 'text-[#f97316]' : 'text-white'}`}>
            <NumberTicker value={escalatedIncidents} />
          </div>
        </div>

        <div className="card flex flex-col gap-2 relative overflow-hidden group hover:border-[#10b981]/50">
          <div className="absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-sm font-medium text-[#9898a8]">Resueltos Hoy</div>
          <div className="text-3xl font-bold text-white"><NumberTicker value={resolvedToday} /></div>
        </div>
        
        <div className="card flex flex-col gap-2 relative overflow-hidden">
          <div className="text-sm font-medium text-[#9898a8]">MTTR (Promedio)</div>
          <div className="text-3xl font-bold text-white flex items-baseline gap-2 relative z-10">
            <NumberTicker value={mttr} /> <span className="text-sm font-normal text-[#9898a8]">horas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Severity Chart */}
        <div className="card lg:col-span-2 flex flex-col animate-slide-in-right" style={{animationDelay: '150ms'}}>
          <h3 className="text-lg font-semibold text-white mb-6">Distribución por Severidad</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
                <XAxis dataKey="name" stroke="#9898a8" tick={{ fill: '#9898a8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#9898a8" tick={{ fill: '#9898a8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#13131d', borderColor: '#2a2a3a', color: '#fff', borderRadius: '8px' }} 
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 3 Analysts */}
        <div className="card flex flex-col animate-slide-in-right" style={{animationDelay: '200ms'}}>
          <h3 className="text-lg font-semibold text-white mb-6">Top 3 Analistas</h3>
          <div className="flex-1 flex flex-col gap-4">
            {topAnalysts.length === 0 ? (
              <div className="text-sm text-[#9898a8]">No hay analistas con incidentes resueltos aún.</div>
            ) : (
              topAnalysts.map((ta, idx) => (
                <div key={ta.user.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#2a2a3a] text-white flex items-center justify-center font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{ta.user.displayName}</div>
                      <div className="text-xs text-[#6a6a7a]">{ta.user.role}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#10b981]">{ta.count}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
