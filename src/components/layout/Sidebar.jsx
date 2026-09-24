import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BATCHES } from '@backend/constants/batches';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  History, 
  BarChart3, 
  LogOut, 
  Calendar, 
  UserCheck, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Code2,
  Cpu,
  TrendingUp,
  Briefcase,
  Zap
} from 'lucide-react';

const iconMap = {
  Code2: Code2,
  Cpu: Cpu,
  TrendingUp: TrendingUp,
  Briefcase: Briefcase
};

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#0E1118]/85 backdrop-blur-md flex flex-col justify-between shrink-0 hidden md:flex transition-colors">
      {/* Top Menu Items */}
      <div className="p-4 space-y-6">
        {/* Role Badge Banner */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#151924] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isAdmin ? 'bg-slate-900 text-amber-400 dark:bg-amber-500 dark:text-slate-950 shadow-sm' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-white'}`}>
              {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white font-mono">{isAdmin ? 'Admin' : 'Student'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{isAdmin ? 'Full System Control' : 'Read-Only View'}</p>
            </div>
          </div>
          {isAdmin && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-mono">DASHBOARDS</p>

          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                  activeTab === 'students'
                    ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Students (68)</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('student-dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                  activeTab === 'student-dashboard'
                    ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Attendance</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('student-history')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                  activeTab === 'student-history'
                    ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Calendar View</span>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Admin Batch Sections */}
        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-mono">CLUB BATCHES</p>
            {BATCHES.map(b => {
              const IconComp = iconMap[b.icon] || Layers;
              const isSelected = activeTab === `batch-${b.id}`;

              return (
                <button
                  key={b.id}
                  onClick={() => setActiveTab(`batch-${b.id}`)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all font-mono ${
                    isSelected
                      ? 'bg-slate-900 text-amber-400 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4" style={{ color: b.color }} />
                    <span>{b.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-60 uppercase">{b.code}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Analytics & Audit Logs */}
        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-mono">REPORTS & AUDIT</p>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                activeTab === 'audit-logs'
                  ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                activeTab === 'reports'
                  ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer / Sign out */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
