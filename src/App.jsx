import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FirebaseSettingsModal } from './components/common/FirebaseSettingsModal';

import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BatchManagement } from './pages/BatchManagement';
import { StudentManagement } from './pages/StudentManagement';
import { AuditLogs } from './pages/AuditLogs';
import { Reports } from './pages/Reports';

const AppContent = () => {
  const { user, isAdmin, isStudent, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('admin-dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize default tab with role
  useEffect(() => {
    if (user) {
      if (isAdmin && activeTab.startsWith('student')) {
        setActiveTab('admin-dashboard');
      } else if (isStudent && !activeTab.startsWith('student')) {
        setActiveTab('student-dashboard');
      }
    }
  }, [user, isAdmin, isStudent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center transition-colors">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading Mitra Club Attendance Portal...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated user -> Login Screen
  if (!user) {
    return <Login />;
  }

  // Render current tab based on role & active Tab state
  const renderCurrentView = () => {
    if (isStudent) {
      if (activeTab === 'student-history') {
        return <StudentDashboard showCalendarOnly={true} />;
      }
      return <StudentDashboard />;
    }

    // Admin Views
    if (activeTab === 'admin-dashboard') {
      return (
        <AdminDashboard
          onSelectBatch={(batchTab) => setActiveTab(batchTab)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );
    }

    if (activeTab.startsWith('batch-')) {
      const batchId = activeTab.replace('batch-', '');
      return <BatchManagement batchId={batchId} key={batchId} />;
    }

    if (activeTab === 'students') {
      return <StudentManagement />;
    }

    if (activeTab === 'audit-logs') {
      return <AuditLogs />;
    }

    if (activeTab === 'reports') {
      return <Reports />;
    }

    return (
      <AdminDashboard
        onSelectBatch={(batchTab) => setActiveTab(batchTab)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090A0D] text-[#0A0A0A] dark:text-[#FFFFFF] flex flex-col font-sans transition-colors duration-200 bg-cyber-grid">
      {/* Top Header Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Body with Sidebar + View Container */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Mobile Tab Switcher */}
          <div className="md:hidden mb-4 overflow-x-auto flex items-center gap-1.5 p-1.5 bg-white dark:bg-[#121318] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs shadow-sm font-mono">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'admin-dashboard' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('batch-vibe-coding')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'batch-vibe-coding' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Vibe Coding
                </button>
                <button
                  onClick={() => setActiveTab('batch-ai')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'batch-ai' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  AI Batch
                </button>
                <button
                  onClick={() => setActiveTab('batch-marketing')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'batch-marketing' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Marketing
                </button>
                <button
                  onClick={() => setActiveTab('batch-industry-connect')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'batch-industry-connect' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Industry
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'students' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Students
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('student-dashboard')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'student-dashboard' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  My Attendance
                </button>
                <button
                  onClick={() => setActiveTab('student-history')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 font-bold ${activeTab === 'student-history' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  Calendar
                </button>
              </>
            )}
          </div>

          {renderCurrentView()}
        </main>
      </div>

      {/* Firebase Settings Modal */}
      <FirebaseSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Portal Error Caught:", error, errorInfo);
  }
  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-indigo-400">Mitra Portal Session Refresh</h2>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto">
              {this.state.error?.message || 'Session data updated'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              Reset Session & Launch Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

