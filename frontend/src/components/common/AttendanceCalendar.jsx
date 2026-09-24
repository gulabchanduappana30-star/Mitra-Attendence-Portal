import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

export const AttendanceCalendar = ({ records = [], onDateClick, title = "Attendance Calendar" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const recordMap = new Map(records.map(r => [r.date, r]));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-5 md:p-6 rounded-3xl space-y-4 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-black text-black dark:text-white text-sm md:text-base uppercase font-heading flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-black dark:text-[#FAC600] border border-neutral-300 dark:border-neutral-700">
            {monthName}
          </span>
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase font-mono tracking-wider text-neutral-400 py-1 border-y border-neutral-100 dark:border-neutral-800">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 font-mono">
        {daysArray.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-11 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20" />;

          const dayStr = String(day).padStart(2, '0');
          const monthStr = String(month + 1).padStart(2, '0');
          const fullDate = `${year}-${monthStr}-${dayStr}`;

          const record = recordMap.get(fullDate);
          const isPresent = record?.status === 'present';
          const isAbsent = record?.status === 'absent';

          return (
            <div
              key={fullDate}
              onClick={() => onDateClick && onDateClick(fullDate)}
              className={`h-11 md:h-12 rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-150 transform hover:scale-105 border ${
                isPresent
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                  : isAbsent
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-300'
                  : 'bg-neutral-50 dark:bg-[#0A0A0D] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-[#FAC600]'
              }`}
              title={`Click to view details for ${fullDate}`}
            >
              <span className="text-xs font-black">{day}</span>
              {isPresent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />}
              {isAbsent && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5" />}
              {!isPresent && !isAbsent && <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mt-0.5" />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="font-bold text-rose-700 dark:text-rose-400">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
          <span className="text-neutral-500">No Session</span>
        </div>
      </div>
    </div>
  );
};
