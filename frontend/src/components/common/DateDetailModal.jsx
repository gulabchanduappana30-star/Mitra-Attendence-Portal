import React, { useState, useEffect } from 'react';
import { dataService } from '@backend/services/dataService';
import { BATCHES, getBatchById } from '@backend/constants/batches';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Search, 
  MinusCircle
} from 'lucide-react';

export const DateDetailModal = ({ dateStr, isOpen, onClose, onRefreshData }) => {
  const { isAdmin, user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  useEffect(() => {
    if (isOpen && dateStr) {
      loadDateData();
    }
  }, [isOpen, dateStr]);

  const loadDateData = async () => {
    setLoading(true);
    const allStudents = await dataService.getUsers(null, 'student');
    const dateRecords = await dataService.getAttendance({ date: dateStr });
    
    setStudents(allStudents);
    setRecords(dateRecords);
    setLoading(false);
  };

  if (!isOpen || !dateStr) return null;

  const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const recordMap = new Map(records.map(r => [r.studentId, r]));

  const handleToggleStatus = async (student, currentStatus) => {
    let nextStatus = 'present';
    if (currentStatus === 'present') nextStatus = 'absent';
    else if (currentStatus === 'absent') nextStatus = 'present';

    const statusMap = { [student.id]: nextStatus };
    await dataService.saveAttendanceRecords(
      student.batchId || 'vibe-coding',
      dateStr,
      statusMap,
      user,
      { [student.id]: `Admin updated status via Master Calendar` }
    );

    addToast(`Updated ${student.name} to ${nextStatus.toUpperCase()} for ${dateStr}`, 'success');
    await loadDateData();
    if (onRefreshData) onRefreshData();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedBatch === 'all') return matchesSearch;
    return matchesSearch && s.batchId === selectedBatch;
  });

  const displayedStudents = isAdmin 
    ? filteredStudents 
    : students.filter(s => s.id === user?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Date Attendance Register</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{formattedDate}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name or USN..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setSelectedBatch('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${selectedBatch === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                All
              </button>
              {BATCHES.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatch(b.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${selectedBatch === b.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  {b.code}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs">Loading attendance for {dateStr}...</p>
            </div>
          ) : displayedStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No student records found for this selection.
            </div>
          ) : (
            displayedStudents.map((student) => {
              const record = recordMap.get(student.id);
              const status = record ? record.status : 'unmarked';
              const b = getBatchById(student.batchId);

              return (
                <div
                  key={student.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white text-xs">{student.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.badge}`}>
                          {b.name}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{student.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      status === 'present'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                        : status === 'absent'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}>
                      {status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                      {status === 'unmarked' && <MinusCircle className="w-3.5 h-3.5" />}
                      {status === 'present' ? 'Present ✓' : status === 'absent' ? 'Absent ✗' : 'No Record / Off'}
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => handleToggleStatus(student, status)}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                      >
                        {status === 'present' ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>{displayedStudents.length} Students Listed</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold"
          >
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
};
