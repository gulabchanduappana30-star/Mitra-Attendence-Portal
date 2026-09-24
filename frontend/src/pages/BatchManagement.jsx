import React, { useState, useEffect } from 'react';
import { getBatchById } from '@backend/constants/batches';
import { dataService } from '@backend/services/dataService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatsCard } from '../components/common/StatsCard';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Save, 
  Users, 
  Check, 
  X, 
  History,
  Zap
} from 'lucide-react';

export const BatchManagement = ({ batchId }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const batch = getBatchById(batchId);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [initialStatusMap, setInitialStatusMap] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [editModalStudent, setEditModalStudent] = useState(null);
  const [editReason, setEditReason] = useState('');
  const [newModalStatus, setNewModalStatus] = useState('present');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBatchData();
  }, [batchId, selectedDate]);

  const loadBatchData = async () => {
    setLoading(true);
    try {
      const studentList = await dataService.getUsers(batchId, 'student');
      const records = await dataService.getAttendance({ batchId, date: selectedDate });

      const map = {};
      records.forEach(r => {
        map[r.studentId] = r.status;
      });

      studentList.forEach(s => {
        if (!map[s.id]) {
          map[s.id] = 'present';
        }
      });

      setStudents(studentList);
      setAttendanceRecords(records);
      setStatusMap(map);
      setInitialStatusMap({ ...map });
    } catch (err) {
      console.error('Error loading batch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (studentId, status) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkStatus = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setStatusMap(updated);
    addToast(`Marked all students as ${status.toUpperCase()} for ${selectedDate}`, 'info');
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      await dataService.saveAttendanceRecords(batchId, selectedDate, statusMap, user);
      addToast(`Attendance saved successfully for ${batch.name} on ${selectedDate}!`, 'success');
      loadBatchData();
    } catch (err) {
      addToast('Failed to save attendance. Please try again.', 'error');
    }
    setSaving(false);
  };

  const handleOpenEditModal = (student) => {
    setEditModalStudent(student);
    setNewModalStatus(statusMap[student.id] === 'present' ? 'absent' : 'present');
    setEditReason('');
  };

  const handleConfirmEditModal = async () => {
    if (!editReason.trim()) {
      addToast('Please provide a reason for modifying attendance record.', 'warning');
      return;
    }

    const updatedMap = {
      ...statusMap,
      [editModalStudent.id]: newModalStatus
    };

    const reasonsMap = {
      [editModalStudent.id]: editReason
    };

    setSaving(true);
    await dataService.saveAttendanceRecords(batchId, selectedDate, updatedMap, user, reasonsMap);
    setSaving(false);

    addToast(`Attendance updated and audit log created for ${editModalStudent.name}!`, 'success');
    setEditModalStudent(null);
    loadBatchData();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && statusMap[s.id] === filterStatus;
  });

  const presentCount = Object.values(statusMap).filter(st => st === 'present').length;
  const absentCount = Object.values(statusMap).filter(st => st === 'absent').length;
  const totalCount = students.length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Batch Header - iQOO Style */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-black text-[#FAC600] dark:bg-[#FAC600] dark:text-black">
              {batch.code}
            </span>
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            {batch.name} <span className="text-amber-500 dark:text-[#FAC600]">ROSTER.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{batch.description}</p>
        </div>

        {/* Date Selector & Save CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-xs text-black dark:text-white font-mono font-bold focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
            />
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] font-mono disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING...' : 'SAVE ATTENDANCE →'}</span>
          </button>
        </div>
      </div>

      {/* Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={totalCount}
          subtitle="Enrolled in batch"
          icon={Users}
          color="gold"
        />
        <StatsCard
          title="Present Today"
          value={presentCount}
          subtitle="Marked Present"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          title="Absent Today"
          value={absentCount}
          subtitle="Marked Absent"
          icon={XCircle}
          color="rose"
        />
        <StatsCard
          title="Session Attendance %"
          value={`${percentage}%`}
          subtitle={`On ${selectedDate}`}
          icon={CheckCircle2}
          color="cyan"
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name, USN, email..."
            className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-[#FAC600] font-medium"
          />
        </div>

        {/* Filters & Bulk Buttons */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0A0A0D] p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'all' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
            >
              ALL ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus('present')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
            >
              PRESENT ({presentCount})
            </button>
            <button
              onClick={() => setFilterStatus('absent')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
            >
              ABSENT ({absentCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('present')}
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1 transition-all"
            >
              <Check className="w-3.5 h-3.5" /> MARK ALL PRESENT
            </button>
            <button
              onClick={() => handleBulkStatus('absent')}
              className="px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5" /> MARK ALL ABSENT
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-black dark:text-white text-base uppercase font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
            <span>Student Roster ({selectedDate})</span>
          </h3>
          <span className="text-xs font-mono text-neutral-500">{filteredStudents.length} Students listed</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-500 font-mono">Loading student roster...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono">No students match your search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-50 dark:bg-[#0A0A0D] text-[11px] uppercase font-black font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">USN / ID</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Status Toggle</th>
                  <th className="py-3.5 px-4 text-right">Audit Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredStudents.map(student => {
                  const status = statusMap[student.id];
                  const isPresent = status === 'present';

                  return (
                    <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-[#181a24] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                          />
                          <div>
                            <p className="font-bold text-black dark:text-white">{student.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">{batch.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-black dark:text-neutral-300 font-bold">{student.studentId}</td>

                      <td className="py-3.5 px-4 text-neutral-500 font-mono">{student.email}</td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 font-mono">
                          <button
                            onClick={() => handleToggleStatus(student.id, 'present')}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> PRESENT
                          </button>
                          <button
                            onClick={() => handleToggleStatus(student.id, 'absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                              !isPresent
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" /> ABSENT
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-[#0A0A0D] hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          title="Edit with Audit Reason"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-black text-black dark:text-white text-base uppercase font-heading flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
                <span>Attendance Audit Edit</span>
              </h3>
              <button
                onClick={() => setEditModalStudent(null)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-200 dark:border-neutral-800 space-y-1 font-mono">
                <p className="font-bold text-black dark:text-white">{editModalStudent.name}</p>
                <p className="text-neutral-500">ID: {editModalStudent.studentId} • Batch: {batch.name}</p>
                <p className="text-neutral-500">Date: {selectedDate}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 font-mono">
                  Change Status To
                </label>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setNewModalStatus('present')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all ${
                      newModalStatus === 'present'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-neutral-50 dark:bg-[#0A0A0D] border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Check className="w-4 h-4" /> PRESENT
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewModalStatus('absent')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all ${
                      newModalStatus === 'absent'
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-neutral-50 dark:bg-[#0A0A0D] border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <X className="w-4 h-4" /> ABSENT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 font-mono">
                  Reason for Modification (Logged into Audit Trail)
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Verified medical certificate, admin correction..."
                  className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-[#FAC600] h-24"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono">
              <button
                onClick={() => setEditModalStudent(null)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEditModal}
                className="px-5 py-2 rounded-full text-xs font-black bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Record Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
