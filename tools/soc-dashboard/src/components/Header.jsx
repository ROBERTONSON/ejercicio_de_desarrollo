import React from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  
  let title = "Operations Center";
  if (location.pathname.startsWith('/dashboard')) title = "SOC Overview";
  if (location.pathname.startsWith('/incidents')) title = "Incident Management";
  if (location.pathname === '/login') return null;

  return (
    <header className="page-header flex items-center justify-between z-30 sticky top-0">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-xs font-medium text-[#22c55e]">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          System Operational
        </div>
      </div>
    </header>
  );
}
