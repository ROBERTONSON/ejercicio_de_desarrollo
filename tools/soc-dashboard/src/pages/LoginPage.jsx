import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleInfo } from '../lib/permissions';

export default function LoginPage() {
  const { users, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    
    if (login(selectedUserId)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4D33DE] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0000EE] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="card w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(77,51,222,0.2)]">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">BLAST Framework</h1>
          <p className="text-[#9898a8]">Security Operations Center Sandbox</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-[#9898a8] mb-2">Select Mock Role</label>
            <div className="flex flex-col gap-3">
              {users.map(u => {
                const isSelected = selectedUserId === u.id;
                const roleInfo = getRoleInfo(u.role);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`text-left p-3 rounded-md border flex items-center gap-4 transition-all duration-200 ${isSelected ? 'bg-[#1a1a24] border-[#4D33DE] shadow-[0_0_0_1px_rgba(77,51,222,1)]' : 'bg-[#13131d] border-[#2a2a3a] hover:border-[#4D33DE]/50 hover:bg-[#1a1a24]'}`}
                  >
                    <div className="text-2xl flex-shrink-0">{roleInfo.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white">{u.displayName}</div>
                      <div className="text-xs text-[#9898a8]">@{u.username} • <span style={{color: roleInfo.color}}>{roleInfo.label}</span></div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#4D33DE] flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(77,51,222,0.8)]">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!selectedUserId}
            className={`btn py-3 mt-4 text-base transition-all duration-300 ${selectedUserId ? 'btn-primary shadow-[0_0_20px_rgba(77,51,222,0.4)]' : 'opacity-50 cursor-not-allowed bg-[#1a1a24] text-[#6a6a7a] border-[#2a2a3a]'}`}
          >
            Access SOC Terminal
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#2a2a3a] text-xs text-[#6a6a7a] text-center">
          <p>Local state only mock data • Strict RBAC active</p>
        </div>
      </div>
    </div>
  );
}
