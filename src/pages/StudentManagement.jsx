import React, { useState, useEffect } from 'react';
import { BATCHES, getBatchById } from '@backend/constants/batches';
import { dataService } from '@backend/services/dataService';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  CloudUpload,
  Zap
} from 'lucide-react';

export const StudentManagement = () => {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    batchId: 'vibe-coding',
    role: 'student'
  });

  const [toggleStudent, setToggleStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const list = await dataService.getUsers(null, 'student');
      setStudents(list);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let pass = 'mitra-';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      studentId: `24PA1A${Math.floor(4500 + Math.random() * 99)}`,
      password: 'mitra123',
      batchId: 'vibe-coding',
      role: 'student'
    });
    setShowPasswordInModal(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId || '',
      password: student.password || 'mitra123',
      batchId: student.batchId || 'vibe-coding',
      role: 'student'
    });
    setShowPasswordInModal(false);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.studentId || !formData.password) {
      addToast('Please fill in all required fields including password.', 'warning');
      return;
    }

    if (editingStudent) {
      await dataService.updateUser(editingStudent.id, formData);
      addToast(`Updated student profile & credentials for ${formData.name}`, 'success');
    } else {
      const newStudent = await dataService.createUser({
        ...formData,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`
      });
      addToast(`Successfully registered ${newStudent.name} with password!`, 'success');
    }

    setIsModalOpen(false);
    loadStudents();
  };

  const togglePasswordVisibility = (studentId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleConfirmToggleActive = async () => {
    if (!toggleStudent) return;
    const newStatus = !toggleStudent.active;
    await dataService.updateUser(toggleStudent.id, { active: newStatus });
    addToast(`${toggleStudent.name} is now ${newStatus ? 'Active' : 'Deactivated'}`, 'info');
    setToggleStudent(null);
    loadStudents();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedBatchFilter === 'all') return matchesSearch;
    return matchesSearch && s.batchId === selectedBatchFilter;
  });

  const handleSyncToFirebase = async () => {
    setSyncing(true);
    const res = await dataService.syncRosterToFirebase();
    setSyncing(false);
    if (res.success) {
      addToast(`Successfully synced ${res.count} student records to Firebase cloud!`, 'success');
    } else {
      addToast(res.message || 'Firebase is in Demo Mode. Connect Firebase credentials to sync.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - iQOO Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#121318] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FAC600]"></span>
            STUDENT DIRECTORY • 68 ENROLLED
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase font-heading">
            STUDENT <span className="text-amber-500 dark:text-[#FAC600]">ROSTER.</span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Manage individual student profiles, passwords, and batch assignments.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncToFirebase}
            disabled={syncing}
            className="px-4 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-mono font-bold text-xs border border-neutral-300 dark:border-neutral-700 flex items-center gap-2 transition-all"
            title="Upload/Sync current roster to Firebase Cloud"
          >
            <CloudUpload className={`w-4 h-4 text-amber-500 ${syncing ? 'animate-bounce' : ''}`} />
            <span>{syncing ? 'SYNCING...' : 'SYNC CLOUD'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 rounded-full bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] font-mono"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ REGISTER STUDENT</span>
          </button>
        </div>
      </div>

      {/* Search & Batch Filters */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, USN, email..."
            className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-[#FAC600] font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0A0A0D] p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedBatchFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${selectedBatchFilter === 'all' ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
          >
            ALL ({students.length})
          </button>
          {BATCHES.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBatchFilter(b.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${selectedBatchFilter === b.id ? 'bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
            >
              {b.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-black dark:text-white text-base uppercase font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500 dark:text-[#FAC600]" />
            <span>Enrolled Students ({filteredStudents.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-500 font-mono">Loading student directory...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono">No students found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-50 dark:bg-[#0A0A0D] text-[11px] uppercase font-black font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">USN / ID</th>
                  <th className="py-3.5 px-4">Assigned Password</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredStudents.map(student => {
                  const b = getBatchById(student.batchId);
                  const isPassVisible = visiblePasswords[student.id];

                  return (
                    <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-[#181a24] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                          />
                          <div>
                            <p className="font-bold text-black dark:text-white">{student.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-black dark:text-neutral-300 font-bold">{student.studentId}</td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-[#0A0A0D] px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono">
                          <KeyRound className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="text-xs text-neutral-900 dark:text-neutral-200 min-w-[70px]">
                            {isPassVisible ? (student.password || 'mitra123') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(student.id)}
                            className="text-neutral-400 hover:text-black dark:hover:text-white ml-1"
                            title="Toggle password view"
                          >
                            {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-700">
                          {b.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.active !== false
                            ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                        }`}>
                          {student.active !== false ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2 font-mono">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-[#0A0A0D] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                          title="Edit Student & Password"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-500" />
                        </button>
                        <button
                          onClick={() => setToggleStudent(student)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-[#0A0A0D] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-rose-600 border border-neutral-200 dark:border-neutral-700"
                          title="Toggle Status"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-black text-black dark:text-white text-base uppercase font-heading">
                {editingStudent ? 'Edit Student & Password' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@mitra.club"
                  className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Student USN / ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white font-mono focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Assign Batch
                  </label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchId: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
                  >
                    {BATCHES.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Setup Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Student Password
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[10px] text-amber-600 dark:text-[#FAC600] hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter student password"
                    className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-3 pr-9 py-2 text-black dark:text-white font-mono focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    {showPasswordInModal ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-black bg-black text-white dark:bg-[#FAC600] dark:text-black shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Toggle Status Modal */}
      <ConfirmationModal
        isOpen={Boolean(toggleStudent)}
        title={`${toggleStudent?.active !== false ? 'Deactivate' : 'Reactivate'} Student Account?`}
        message={`Are you sure you want to change status for ${toggleStudent?.name}?`}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setToggleStudent(null)}
        confirmText="Confirm Status Change"
        isDanger={toggleStudent?.active !== false}
      />
    </div>
  );
};
