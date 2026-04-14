import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleInfo } from '../lib/permissions';

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleInfo = currentUser ? getRoleInfo(currentUser.role) : null;

  return (
    <aside className="sidebar">
      <div className="p-6 border-b border-[#2a2a3a]">
        <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded bg-[#4D33DE] flex items-center justify-center shadow-[0_0_15px_rgba(77,51,222,0.5)]">
            ⚡
          </span>
          BLAST <span className="text-[#9898a8] font-normal text-sm pt-1">SOC</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => 
            `px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${isActive ? 'bg-[#1a1a24] text-white border border-[#2a2a3a]' : 'text-[#9898a8] hover:bg-[#1a1a24] hover:text-[#e8e8ed]'}`
          }
        >
          📊 Dashboard
        </NavLink>
        <NavLink 
          to="/incidents" 
          className={({isActive}) => 
            `px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${isActive ? 'bg-[#1a1a24] text-white border border-[#2a2a3a]' : 'text-[#9898a8] hover:bg-[#1a1a24] hover:text-[#e8e8ed]'}`
          }
        >
          🚨 Incidents
        </NavLink>
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-[#2a2a3a]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#2a2a3a] flex items-center justify-center text-lg">
              {roleInfo?.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{currentUser.displayName}</div>
              <div className="text-xs" style={{ color: roleInfo?.color }}>{roleInfo?.label}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn w-full justify-center">
            Log Out
          </button>
        </div>
      )}
    </aside>
  );
}
