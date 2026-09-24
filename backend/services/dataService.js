import { isFirebaseConfigured, db } from '../config/firebase.js';
import { MOCK_USERS, INITIAL_ATTENDANCE, INITIAL_AUDIT_LOGS } from '../mock/mockData.js';
import { resolveBatchId } from '../constants/batches.js';
import { collection, getDocs, doc, setDoc, updateDoc, query, where, addDoc } from 'firebase/firestore';

// Local Storage Keys for offline/mock mode
const STORAGE_KEYS = {
  USERS: 'mitra_users_v2',
  ATTENDANCE: 'mitra_attendance_v2',
  AUDIT_LOGS: 'mitra_audit_logs_v2'
};



// Initialize LocalStorage with seed data if empty or outdated
const initLocalStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    const existingUsersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    // Auto-update local storage if empty or less than full 68 student roster
    if (existingUsers.length < MOCK_USERS.length) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    } else {
      let updated = false;
      existingUsers.forEach(u => {
        if (u.id === 'usr_admin_1') {
          u.name = 'Admin';
          u.password = 'mitra@1234';
          u.studentId = 'ADMIN';
          u.email = 'admin@mitra.club';
          updated = true;
        } else {
          // Update student email to @gmail.com if it was @mitra.club
          if (u.email && u.email.endsWith('@mitra.club')) {
            u.email = u.email.replace('@mitra.club', '@gmail.com');
            updated = true;
          }
          if (!u.password) {
            const seedMatch = MOCK_USERS.find(m => m.id === u.id);
            u.password = seedMatch ? seedMatch.password : 'mitra123';
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));
      }
    }

    // Refresh active session if admin
    const savedActive = localStorage.getItem('mitra_active_user');
    if (savedActive) {
      const activeObj = JSON.parse(savedActive);
      if (activeObj.id === 'usr_admin_1' || activeObj.role === 'admin') {
        activeObj.name = 'Admin';
        activeObj.password = 'mitra@1234';
        localStorage.setItem('mitra_active_user', JSON.stringify(activeObj));
      }
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
};

initLocalStorage();

// Helper to fetch array from LocalStorage
const getLocalData = (key) => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(key) || '[]');
};
const setLocalData = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const dataService = {
  // --- USER MANAGEMENT ---
  async getUsers(batchId = null, role = null) {
    if (isFirebaseConfigured() && db) {
      try {
        let q = collection(db, 'users');
        if (batchId) q = query(q, where('batchId', '==', batchId));
        if (role) q = query(q, where('role', '==', role));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('Firestore error, using LocalStorage fallback', err);
      }
    }
    
    let users = getLocalData(STORAGE_KEYS.USERS);
    if (!users || users.length === 0) {
      users = MOCK_USERS;
      setLocalData(STORAGE_KEYS.USERS, MOCK_USERS);
    }
    if (batchId) users = users.filter(u => u.batchId === batchId);
    if (role) users = users.filter(u => u.role === role);
    return users;
  },

  async getUserById(userId) {
    const users = await this.getUsers();
    let found = users.find(u => u.id === userId);
    if (!found) {
      const localUsers = getLocalData(STORAGE_KEYS.USERS);
      found = localUsers.find(u => u.id === userId) || MOCK_USERS.find(u => u.id === userId);
    }
    return found || null;
  },

  async findUserByIdentifier(identifier) {
    if (!identifier) return null;
    let users = await this.getUsers();
    if (!users || users.length === 0) {
      users = getLocalData(STORAGE_KEYS.USERS);
      if (!users || users.length === 0) users = MOCK_USERS;
    }
    const cleanId = identifier.trim().toLowerCase();
    
    // 1. Check Admin aliases directly
    if (
      cleanId === 'admin' || 
      cleanId === 'admin@mitra.club' || 
      cleanId === 'admin@gmail.com' || 
      cleanId === 'adm-001' ||
      cleanId === 'usr_admin_1'
    ) {
      const adminUser = users.find(u => u.role === 'admin' || u.id === 'usr_admin_1') || MOCK_USERS.find(u => u.role === 'admin');
      if (adminUser) return adminUser;
    }

    // 2. Direct exact match on email, studentId (USN), or full name
    let found = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.studentId && u.studentId.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );
    if (found) return found;

    // 3. Flexible Gmail / Email prefix matching
    const userPrefix = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;

    found = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uEmailPrefix = uEmail.split('@')[0];
      const uStudentId = (u.studentId || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      const uNameNoSpace = uName.replace(/[^a-z0-9]/g, '');

      return (
        (uEmailPrefix && uEmailPrefix === userPrefix) ||
        (uStudentId && uStudentId === userPrefix) ||
        (uStudentId && userPrefix.includes(uStudentId)) ||
        (uNameNoSpace && (uNameNoSpace === userPrefix || uNameNoSpace.includes(userPrefix) || userPrefix.includes(uNameNoSpace)))
      );
    });
    if (found) return found;

    // 4. Admin fallback if nothing else matched and role is admin
    if (cleanId.includes('admin')) {
      return users.find(u => u.role === 'admin') || MOCK_USERS[0];
    }

    return null;
  },

  async createUser(userData) {
    const newId = `usr_${Date.now()}`;
    const newUser = {
      id: newId,
      ...userData,
      active: true,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'users', newId), newUser);
      } catch (e) {
        console.warn('Firestore user insert failed', e);
      }
    }

    const users = getLocalData(STORAGE_KEYS.USERS);
    users.push(newUser);
    setLocalData(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  async updateUser(userId, updates) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'users', userId), updates);
      } catch (e) {
        console.warn('Firestore user update failed', e);
      }
    }

    const users = getLocalData(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      setLocalData(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  async syncRosterToFirebase() {
    if (!isFirebaseConfigured() || !db) {
      return { success: false, message: 'Firebase is not configured or connected.' };
    }
    try {
      const users = getLocalData(STORAGE_KEYS.USERS);
      for (const u of users) {
        await setDoc(doc(db, 'users', u.id), u);
      }
      return { success: true, count: users.length };
    } catch (e) {
      console.error('Firebase sync error', e);
      return { success: false, error: e.message };
    }
  },


  // --- ATTENDANCE MANAGEMENT ---
  async getAttendance({ batchId, studentId, date, startDate, endDate } = {}) {
    if (isFirebaseConfigured() && db) {
      try {
        let q = collection(db, 'attendance');
        if (batchId) q = query(q, where('batchId', '==', batchId));
        if (studentId) q = query(q, where('studentId', '==', studentId));
        if (date) q = query(q, where('date', '==', date));
        const snapshot = await getDocs(q);
        let docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        if (startDate) docs = docs.filter(d => d.date >= startDate);
        if (endDate) docs = docs.filter(d => d.date <= endDate);
        return docs;
      } catch (err) {
        console.warn('Firestore attendance fetch failed, fallback to local', err);
      }
    }

    let records = getLocalData(STORAGE_KEYS.ATTENDANCE);
    if (batchId) records = records.filter(r => r.batchId === batchId);
    if (studentId) records = records.filter(r => r.studentId === studentId);
    if (date) records = records.filter(r => r.date === date);
    if (startDate) records = records.filter(r => r.date >= startDate);
    if (endDate) records = records.filter(r => r.date <= endDate);

    return records;
  },

  // Save/Update Attendance for a batch on a date (Prevent Duplicates + Create Audit Trail)
  async saveAttendanceRecords(batchId, date, studentStatusMap, adminUser, editReasonsMap = {}) {
    const existingRecords = await this.getAttendance({ batchId, date });
    const users = await this.getUsers(batchId);
    const userMap = new Map(users.map(u => [u.id, u]));

    const allRecords = getLocalData(STORAGE_KEYS.ATTENDANCE);
    const allAuditLogs = getLocalData(STORAGE_KEYS.AUDIT_LOGS);

    const nowIso = new Date().toISOString();

    for (const [studentId, newStatus] of Object.entries(studentStatusMap)) {
      const existing = existingRecords.find(r => r.studentId === studentId);
      const student = userMap.get(studentId) || { name: 'Student' };

      if (existing) {
        if (existing.status !== newStatus) {
          const previousStatus = existing.status;
          existing.status = newStatus;
          existing.updatedAt = nowIso;
          existing.markedBy = adminUser.id;
          existing.markedByName = adminUser.name;

          const auditLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            attendanceId: existing.id,
            studentId,
            studentName: student.name,
            batchId,
            date,
            modifiedBy: adminUser.id,
            modifiedByName: adminUser.name,
            previousStatus,
            newStatus,
            reason: editReasonsMap[studentId] || 'Administrative correction',
            timestamp: nowIso
          };

          allAuditLogs.unshift(auditLog);

          if (isFirebaseConfigured() && db) {
            try {
              await updateDoc(doc(db, 'attendance', existing.id), {
                status: newStatus,
                updatedAt: nowIso,
                markedBy: adminUser.id
              });
              await addDoc(collection(db, 'auditLogs'), auditLog);
            } catch (e) { console.warn('Firestore update error', e); }
          }

          const idx = allRecords.findIndex(r => r.id === existing.id);
          if (idx !== -1) allRecords[idx] = existing;
        }
      } else {
        const newRecord = {
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId,
          batchId,
          date,
          status: newStatus,
          markedBy: adminUser.id,
          markedByName: adminUser.name,
          createdAt: nowIso,
          updatedAt: nowIso
        };

        allRecords.push(newRecord);

        if (isFirebaseConfigured() && db) {
          try {
            await setDoc(doc(db, 'attendance', newRecord.id), newRecord);
          } catch (e) { console.warn('Firestore insert error', e); }
        }
      }
    }

    setLocalData(STORAGE_KEYS.ATTENDANCE, allRecords);
    setLocalData(STORAGE_KEYS.AUDIT_LOGS, allAuditLogs);

    return true;
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    if (isFirebaseConfigured() && db) {
      try {
        const snapshot = await getDocs(collection(db, 'auditLogs'));
        const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (e) { console.warn('Audit logs fetch failed', e); }
    }
    const logs = getLocalData(STORAGE_KEYS.AUDIT_LOGS);
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // --- CALCULATIONS & STATS ---
  async getStudentAnalytics(studentId) {
    const student = await this.getUserById(studentId);
    if (!student) return null;

    const records = await this.getAttendance({ studentId });
    const totalDays = records.length;
    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;

    const overallPercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    const weeks = {};
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() - i * 7);
      const startOfWeek = new Date(endOfWeek);
      startOfWeek.setDate(endOfWeek.getDate() - 6);

      const label = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      const startStr = startOfWeek.toISOString().split('T')[0];
      const endStr = endOfWeek.toISOString().split('T')[0];

      const weekRecords = records.filter(r => r.date >= startStr && r.date <= endStr);
      const weekPresent = weekRecords.filter(r => r.status === 'present').length;
      const weekTotal = weekRecords.length;
      const weekPercentage = weekTotal > 0 ? Math.round((weekPresent / weekTotal) * 100) : 0;

      weeks[label] = {
        label,
        present: weekPresent,
        absent: weekTotal - weekPresent,
        total: weekTotal,
        percentage: weekPercentage
      };
    }

    const months = {};
    records.forEach(r => {
      const monthKey = r.date.substring(0, 7);
      if (!months[monthKey]) {
        const [year, m] = monthKey.split('-');
        const monthName = new Date(year, parseInt(m) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        months[monthKey] = { label: monthName, present: 0, absent: 0, total: 0 };
      }
      months[monthKey].total++;
      if (r.status === 'present') months[monthKey].present++;
      else months[monthKey].absent++;
    });

    Object.values(months).forEach(m => {
      m.percentage = m.total > 0 ? Math.round((m.present / m.total) * 100) : 0;
    });

    return {
      student,
      records: records.sort((a, b) => b.date.localeCompare(a.date)),
      stats: {
        totalDays,
        presentCount,
        absentCount,
        percentage: overallPercentage,
        weeklyBreakdown: Object.values(weeks),
        monthlyBreakdown: Object.values(months)
      }
    };
  },

  async getBatchAnalytics(batchId) {
    const students = await this.getUsers(batchId, 'student');
    const records = await this.getAttendance({ batchId });

    const totalStudents = students.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === todayStr);

    const todayPresent = todayRecords.filter(r => r.status === 'present').length;
    const todayAbsent = todayRecords.filter(r => r.status === 'absent').length;
    const todayPercentage = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

    const totalPresentAllTime = records.filter(r => r.status === 'present').length;
    const totalRecordsAllTime = records.length;
    const overallPercentage = totalRecordsAllTime > 0 ? Math.round((totalPresentAllTime / totalRecordsAllTime) * 100) : 0;

    return {
      batchId,
      totalStudents,
      todayStats: {
        markedCount: todayRecords.length,
        presentCount: todayPresent,
        absentCount: todayAbsent,
        percentage: todayPercentage
      },
      overallPercentage,
      students
    };
  },

  async getClubOverview() {
    const allStudents = await this.getUsers(null, 'student');
    const allRecords = await this.getAttendance();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = allRecords.filter(r => r.date === todayStr);

    const todayPresent = todayRecords.filter(r => r.status === 'present').length;
    const todayAbsent = todayRecords.filter(r => r.status === 'absent').length;
    const todayPercentage = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

    const totalPresent = allRecords.filter(r => r.status === 'present').length;
    const overallPercentage = allRecords.length > 0 ? Math.round((totalPresent / allRecords.length) * 100) : 0;

    return {
      totalStudents: allStudents.length,
      todayAttendanceRate: todayPercentage,
      todayPresent,
      todayAbsent,
      todayMarkedTotal: todayRecords.length,
      overallPercentage,
      totalRecordsCount: allRecords.length
    };
  }
};
