import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '@backend/services/dataService';
import { getBatchById } from '@backend/constants/batches';
import { StatsCard } from '../components/common/StatsCard';
import { AttendanceCalendar } from '../components/common/AttendanceCalendar';
import { DateDetailModal } from '../components/common/DateDetailModal';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Clock, 
  BarChart2,
  CalendarCheck,
  MinusCircle,
  Zap,
  Sparkles
} from 'lucide-react';

export const StudentDashboard = ({ showCalendarOnly = false }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState('all');

  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const studentBatch = getBatchById(user?.batchId);

  useEffect(() => {
    if (user?.id) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getStudentAnalytics(user.id);
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500 space-y-4 font-mono">
        <div className="w-9 h-9 border-3 border-[#FAC600] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs uppercase tracking-wider">Calculating student attendance statistics...</p>
      </div>
    );
  }

  const { stats = { percentage: 0, totalClasses: 0, attended: 0, missed: 0, weeklyBreakdown: [], monthlyBreakdown: [] }, records = [] } = analytics || {};
  const percentage = stats?.percentage || 0;

  const recordMap = new Map((records || []).map(r => [r.date, r]));

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const everydayList = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const fullDate = `${year}-${monthStr}-${dayStr}`;

    const record = recordMap.get(fullDate);

    everydayList.push({
      date: fullDate,
      dayNumber: day,
      status: record ? record.status : 'off',
      markedByName: record ? record.markedByName : null,
      recordId: record ? record.id : `off_${fullDate}`
    });
  }

  const filteredEverydayList = everydayList.reverse().filter(item => {
    if (dayFilter === 'present') return item.status === 'present';
    if (dayFilter === 'absent') return item.status === 'absent';
    if (dayFilter === 'off') return item.status === 'off';
    return true;
  });

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatDayDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateClick = (dateStr) => {
    setSelectedDateStr(dateStr);
    setIsDateModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner - iQOO Style */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-black text-[#FAC600] dark:bg-[#FAC600] dark:text-black">
              {studentBatch?.name || 'Vibe Coding'}
            </span>
            <span className="text-xs font-mono text-neutral-500 font-bold">USN: {user?.studentId}</span>
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            WELCOME, <span className="text-amber-500 dark:text-[#FAC600]">{user?.name}.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            30-Day Attendance Tracker • Live Session Verification
          </p>
        </div>

        {/* Circular Monthly Total Progress Ring */}
        <div className="flex items-center gap-4 bg-neutral-50 dark:bg-[#0A0A0D] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shrink-0 shadow-sm">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-neutral-200 dark:text-neutral-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`${percentage >= 75 ? 'text-[#FAC600]' : percentage >= 60 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-black dark:text-white font-mono">{percentage}%</span>
              <span className="text-[9px] uppercase font-black text-neutral-400 font-mono">RATE</span>
            </div>
          </div>

          <div className="space-y-1 font-mono">
            <p className="text-xs font-black text-black dark:text-white uppercase">STATUS</p>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
              percentage >= 75 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
            }`}>
              {percentage >= 75 ? 'Good Standing ✓' : 'Attention Needed ⚠️'}
            </span>
            <p className="text-[10px] text-neutral-500">Target: 75% Criteria</p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Days Present"
          value={stats.presentCount || 0}
          subtitle={`Out of ${stats.totalDays || 0} marked session days`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          title="Total Days Absent"
          value={stats.absentCount || 0}
          subtitle="Unattended sessions"
          icon={XCircle}
          color="rose"
        />
        <StatsCard
          title="Monthly Percentage"
          value={`${stats.percentage || 0}%`}
          subtitle="Calculation: (Present / Total) × 100"
          icon={TrendingUp}
          color="gold"
        />
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Attendance Breakdown */}
          <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
                <h3 className="font-black text-black dark:text-white text-base uppercase font-heading">Weekly Attendance Tracker</h3>
              </div>
              <span className="text-xs text-neutral-500 font-mono font-bold">4-WEEK HISTORY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(stats.weeklyBreakdown || []).map((week, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black dark:text-white">{week.label}</span>
                    <span className={`font-black ${week.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {week.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${week.percentage >= 75 ? 'bg-[#FAC600]' : 'bg-rose-500'} transition-all duration-500`}
                      style={{ width: `${week.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                    <span>Present: {week.present} days</span>
                    <span>Absent: {week.absent} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Everyday Register List */}
          <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-black dark:text-white text-base uppercase font-heading flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
                  <span>30-Day Attendance Log</span>
                </h3>
                <p className="text-xs text-neutral-500">Every single date marked with official audit verification</p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0A0A0D] p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                <button
                  onClick={() => setDayFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${dayFilter === 'all' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setDayFilter('present')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${dayFilter === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  PRESENT
                </button>
                <button
                  onClick={() => setDayFilter('absent')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${dayFilter === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  ABSENT
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredEverydayList.map(item => (
                <div
                  key={item.date}
                  onClick={() => handleDateClick(item.date)}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs cursor-pointer hover:border-black dark:hover:border-[#FAC600] transition-colors font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-black dark:text-white text-xs">
                      {item.dayNumber}
                    </div>
                    <div>
                      <p className="font-bold text-black dark:text-white">{formatDayDate(item.date)}</p>
                      <p className="text-[10px] text-neutral-500">
                        {item.markedByName ? `Verified by ${item.markedByName}` : 'Regular scheduled club date'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {item.status === 'present' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        PRESENT
                      </span>
                    ) : item.status === 'absent' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300">
                        ABSENT
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                        OFF DAY
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Calendar */}
        <div className="lg:col-span-1">
          <AttendanceCalendar
            records={records}
            onDateClick={handleDateClick}
            title="My Attendance Calendar"
          />
        </div>
      </div>

      {/* Date Detail Modal */}
      <DateDetailModal
        dateStr={selectedDateStr}
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onRefreshData={loadStudentData}
      />
    </div>
  );
};
