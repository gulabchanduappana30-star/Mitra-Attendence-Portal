import React, { useState, useEffect } from 'react';
import { BATCHES } from '@backend/constants/batches';
import { dataService } from '@backend/services/dataService';
import { StatsCard } from '../components/common/StatsCard';
import { PieChartCard } from '../components/common/PieChartCard';
import { AttendanceCalendar } from '../components/common/AttendanceCalendar';
import { DateDetailModal } from '../components/common/DateDetailModal';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Code2, 
  Cpu, 
  TrendingUp as MktIcon, 
  Briefcase,
  History,
  ShieldCheck,
  Calendar,
  Zap,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Code2: Code2,
  Cpu: Cpu,
  TrendingUp: MktIcon,
  Briefcase: Briefcase
};

export const AdminDashboard = ({ onSelectBatch, onNavigateTab }) => {
  const [clubOverview, setClubOverview] = useState(null);
  const [batchSummaries, setBatchSummaries] = useState({});
  const [recentAudits, setRecentAudits] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date Modal State
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const overview = await dataService.getClubOverview();
      setClubOverview(overview);

      const summaries = {};
      for (const b of BATCHES) {
        summaries[b.id] = await dataService.getBatchAnalytics(b.id);
      }
      setBatchSummaries(summaries);

      const attendanceRecords = await dataService.getAttendance();
      setAllAttendance(attendanceRecords);

      const logs = await dataService.getAuditLogs();
      setRecentAudits(logs.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (dateStr) => {
    setSelectedDateStr(dateStr);
    setIsDateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500 space-y-4">
        <div className="w-9 h-9 border-3 border-[#FAC600] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-mono font-bold uppercase tracking-wider">Syncing Mitra Attendance Metrics...</p>
      </div>
    );
  }

  const totalPresent = clubOverview.todayPresent || 0;
  const totalAbsent = clubOverview.todayAbsent || 0;
  const pendingCheckins = Math.max(0, clubOverview.totalStudents - (totalPresent + totalAbsent));

  const attendanceRatioData = [
    { label: 'Present Today', value: totalPresent, color: '#FAC600' },
    { label: 'Absent Today', value: totalAbsent, color: '#EF4444' },
    { label: 'Unmarked', value: pendingCheckins, color: '#A1A1AA' },
  ];

  const batchComparisonData = BATCHES.map(b => {
    const summary = batchSummaries[b.id] || { overallPercentage: 75 };
    return {
      label: b.name,
      value: summary.overallPercentage || 80,
      color: b.color === '#f59e0b' ? '#FAC600' : b.color,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Header - iQOO Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#121318] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FAC600]"></span>
            ADMIN CONSOLE • MASTER OVERVIEW
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            CLUB <span className="text-amber-500 dark:text-[#FAC600]">ANALYTICS.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            Managing Vibe Coding, AI, Marketing, and Industry Connect rosters.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('students')}
          className="px-6 py-3 rounded-full bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] font-mono"
        >
          <Users className="w-4 h-4" />
          <span>MANAGE STUDENTS (68) →</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Club Students"
          value={clubOverview.totalStudents}
          subtitle="Enrolled in active batches"
          icon={Users}
          color="gold"
        />
        <StatsCard
          title="Active Batches"
          value={BATCHES.length}
          subtitle="4 Specialized Tracks"
          icon={Layers}
          color="cyan"
        />
        <StatsCard
          title="Today's Attendance Rate"
          value={`${clubOverview.todayAttendanceRate}%`}
          subtitle={`${clubOverview.todayPresent} present / ${clubOverview.todayAbsent} absent`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Overall Club Average"
          value={`${clubOverview.overallPercentage}%`}
          subtitle={`Across ${clubOverview.totalRecordsCount} marked sessions`}
          icon={CheckCircle2}
          color="gold"
        />
      </div>

      {/* Interactive Master Club Calendar & Pie Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendanceCalendar
            records={allAttendance}
            onDateClick={handleDateClick}
            title="Master Attendance Calendar"
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PieChartCard
            title="Daily Attendance Breakdown"
            subtitle="Distribution of present, absent & unmarked students"
            data={attendanceRatioData}
            isDonut={true}
          />
          <PieChartCard
            title="Batch Performance Comparison"
            subtitle="Attendance rates across all 4 club programs"
            data={batchComparisonData}
            isDonut={true}
          />
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-black dark:text-white uppercase tracking-tight font-heading flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FAC600]"></span>
            Mitra Club Batches
          </h2>
          <span className="text-xs font-mono text-neutral-500">Click any card to mark attendance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BATCHES.map(b => {
            const IconComp = iconMap[b.icon] || Layers;
            const summary = batchSummaries[b.id] || { totalStudents: 0, overallPercentage: 0, todayStats: { percentage: 0, presentCount: 0 } };

            return (
              <div
                key={b.id}
                onClick={() => onSelectBatch(`batch-${b.id}`)}
                className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:border-black dark:hover:border-[#FAC600] group shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-black dark:text-white group-hover:text-amber-500 dark:group-hover:text-[#FAC600] transition-colors">
                      <IconComp className="w-6 h-6" style={{ color: b.color }} />
                    </div>
                    <div>
                      <h3 className="font-black text-black dark:text-white text-base font-heading group-hover:text-amber-500 dark:group-hover:text-[#FAC600] transition-colors flex items-center gap-2">
                        {b.name}
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700">
                          {b.code}
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium line-clamp-1">{b.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 dark:group-hover:text-[#FAC600] group-hover:translate-x-1 transition-all" />
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm font-black text-black dark:text-white">{summary.totalStudents}</span>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Students</p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{summary.todayStats.percentage}%</span>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Today</p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm font-black text-amber-600 dark:text-[#FAC600]">{summary.overallPercentage}%</span>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Average</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end text-xs text-neutral-500 font-mono">
                  <span className="text-black dark:text-[#FAC600] font-bold group-hover:underline">Manage Attendance →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Trail Preview */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
            <h3 className="font-black text-black dark:text-white text-base uppercase font-heading">Recent Attendance Audit Trail</h3>
          </div>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="text-xs font-mono font-bold text-amber-600 dark:text-[#FAC600] hover:underline"
          >
            VIEW FULL AUDIT LOGS →
          </button>
        </div>

        {recentAudits.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2 font-mono">No attendance modifications recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {recentAudits.map(log => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    log.newStatus === 'present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {log.previousStatus} → {log.newStatus}
                  </span>
                  <div>
                    <span className="font-bold text-black dark:text-white">{log.studentName}</span>
                    <span className="text-neutral-500 text-[11px]"> ({log.date}) — {log.reason}</span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-neutral-400">
                  <span>By {log.modifiedByName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Detail Modal */}
      <DateDetailModal
        dateStr={selectedDateStr}
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onRefreshData={loadDashboardData}
      />
    </div>
  );
};
