import React, { useState, useEffect } from 'react';
import { dataService } from '@backend/services/dataService';
import { getBatchById } from '@backend/constants/batches';
import { History, Search, ShieldCheck, Clock, Filter, Zap } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.modifiedByName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.date?.includes(searchQuery);
    if (selectedBatch === 'all') return matchesSearch;
    return matchesSearch && log.batchId === selectedBatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - iQOO Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#121318] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FAC600]"></span>
            SECURITY & COMPLIANCE • IMMUTABLE AUDIT TRAIL
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            AUDIT <span className="text-amber-500 dark:text-[#FAC600]">HISTORY.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            Verifiable logs of every manual override, administrator identity, timestamp, and modification rationale.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by student, admin, reason..."
            className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-[#FAC600] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600] font-bold"
          >
            <option value="all">ALL BATCHES</option>
            <option value="vibe-coding">VIBE CODING</option>
            <option value="ai">AI BATCH</option>
            <option value="marketing">MARKETING</option>
            <option value="industry-connect">INDUSTRY CONNECT</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-black dark:text-white text-base uppercase font-heading flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
            <span>Audit Entries ({filteredLogs.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-500 font-mono">Loading audit trail records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 italic font-mono">No audit log records match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-50 dark:bg-[#0A0A0D] text-[11px] uppercase font-black font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Transition</th>
                  <th className="py-3.5 px-4">Reason / Rationale</th>
                  <th className="py-3.5 px-4">Modified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                {filteredLogs.map(log => {
                  const batch = getBatchById(log.batchId);
                  const formattedTime = new Date(log.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-[#181a24] transition-colors">
                      <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{formattedTime}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-black dark:text-white">{log.studentName}</td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-700">
                          {batch?.name || log.batchId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-black dark:text-neutral-300 font-bold">{log.date}</td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-neutral-100 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800">
                          <span className={log.previousStatus === 'present' ? 'text-emerald-600' : 'text-rose-600'}>
                            {log.previousStatus.toUpperCase()}
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className={log.newStatus === 'present' ? 'text-emerald-600' : 'text-rose-600'}>
                            {log.newStatus.toUpperCase()}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 italic max-w-xs truncate font-sans">
                        "{log.reason}"
                      </td>

                      <td className="py-3.5 px-4 text-amber-600 dark:text-[#FAC600] font-bold">
                        {log.modifiedByName || 'Admin'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
