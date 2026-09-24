import React, { useState, useEffect } from 'react';
import { BATCHES, getBatchById } from '@backend/constants/batches';
import { dataService } from '@backend/services/dataService';
import { useToast } from '../context/ToastContext';
import { Download, FileSpreadsheet, Calendar, Filter, BarChart3, CheckCircle2, Zap } from 'lucide-react';

export const Reports = () => {
  const { addToast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [batchStats, setBatchStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedBatch, startDate, endDate]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const statsList = [];
      const targetBatches = selectedBatch === 'all' ? BATCHES : BATCHES.filter(b => b.id === selectedBatch);

      for (const b of targetBatches) {
        const students = await dataService.getUsers(b.id, 'student');
        const records = await dataService.getAttendance({ batchId: b.id, startDate, endDate });

        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = records.filter(r => r.status === 'absent').length;

        const rate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

        statsList.push({
          batch: b,
          totalStudents: students.length,
          totalSessions: new Set(records.map(r => r.date)).size,
          totalRecords: records.length,
          presentCount,
          absentCount,
          rate
        });
      }

      setBatchStats(statsList);
    } catch (err) {
      console.error('Error loading reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const records = await dataService.getAttendance({
        batchId: selectedBatch === 'all' ? null : selectedBatch,
        startDate,
        endDate
      });

      const users = await dataService.getUsers();
      const userMap = new Map(users.map(u => [u.id, u]));

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Record ID,Student Name,Student ID,Email,Batch,Date,Status,Marked By\n";

      records.forEach(r => {
        const student = userMap.get(r.studentId) || { name: 'Unknown', email: 'N/A', studentId: 'N/A' };
        const batch = getBatchById(r.batchId);
        csvContent += `"${r.id}","${student.name}","${student.studentId}","${student.email}","${batch.name}","${r.date}","${r.status}","${r.markedByName || 'Admin'}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Mitra_Club_Attendance_Report_${selectedBatch}_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('Attendance CSV Report downloaded successfully!', 'success');
    } catch (e) {
      addToast('Failed to export CSV report.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - iQOO Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#121318] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FAC600]"></span>
            ANALYTICS & EXPORT • CSV GENERATION
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            REPORTS & <span className="text-amber-500 dark:text-[#FAC600]">EXPORTS.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Generate, inspect, and export complete batch attendance records.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-6 py-3 rounded-full bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] font-mono"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV REPORT →</span>
        </button>
      </div>

      {/* Filters Box */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm font-mono text-xs">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">BATCH</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white font-bold focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
            >
              <option value="all">ALL 4 BATCHES</option>
              {BATCHES.map(b => (
                <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">FROM DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white font-bold focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">TO DATE</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white font-bold focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
            />
          </div>
        </div>
      </div>

      {/* Batch Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batchStats.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-black text-[#FAC600] dark:bg-[#FAC600] dark:text-black">
                  {item.batch.code}
                </span>
                <h3 className="font-black text-black dark:text-white text-base mt-2 uppercase font-heading">{item.batch.name} Batch</h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-2xl font-black text-black dark:text-white">{item.rate}%</span>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Attendance Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <span className="font-black text-black dark:text-white text-sm">{item.totalStudents}</span>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Students</p>
              </div>
              <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{item.presentCount}</span>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Present</p>
              </div>
              <div className="bg-neutral-50 dark:bg-[#0A0A0D] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <span className="font-black text-rose-600 dark:text-rose-400 text-sm">{item.absentCount}</span>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Absent</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
