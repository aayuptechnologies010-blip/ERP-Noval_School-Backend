const Timetable = require('../models/timetableModel');
const Staff = require('../models/staffModel');
const Subject = require('../models/subjectModel');
const TimetableSubstitution = require('../models/timetableSubstitutionModel');
const TimetableParallelAllocation = require('../models/timetableParallelAllocationModel');
const TimetableConsecutiveAllocation = require('../models/timetableConsecutiveAllocationModel');
const Resource = require('../models/resourceModel');

// Helper
const getAllTimetables = () =>
  Timetable.find().populate('schedule.periods.teacher', 'firstName lastName contactNo gender designation');

const staffName = (s) =>
  s ? (s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()) : '—';

// ----------------------------------------------------------------
// GET /api/timetable-reports/filters
// ----------------------------------------------------------------
const getReportFilters = async (req, res) => {
  try {
    const [timetables, staff, subjects] = await Promise.all([
      Timetable.find({}, 'class section'),
      Staff.find({}, 'firstName lastName contactNo wing').sort('firstName'),
      Subject.find({}, 'name').sort('name')
    ]);

    const classes = [...new Set(timetables.map(t => t.class))].sort();
    const sections = [...new Set(timetables.map(t => t.section))].sort();
    const teachers = staff.map(s => ({ _id: s._id, name: staffName(s) }));
    const wings = [...new Set(staff.map(s => s.wing).filter(Boolean))].sort();
    const subjectNames = subjects.map(s => s.name);

    res.json({ classes, sections, teachers, wings, subjects: subjectNames });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/classes
// ----------------------------------------------------------------
const getClassList = async (req, res) => {
  try {
    const timetables = await Timetable.find({}, 'class section');
    const data = timetables.map((t, idx) => ({
      sn: idx + 1,
      className: t.class,
      section: t.section,
      noOfPeriods: 48
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/subjects
// ----------------------------------------------------------------
const getSubjectList = async (req, res) => {
  try {
    const subjects = await Subject.find({}, 'name type').sort('name');
    const data = subjects.map((s, i) => ({
      sn: i + 1,
      name: s.name,
      shortName: s.name.slice(0, 10),
      type: s.type || 'Major'
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/teacher-class-subject
// ----------------------------------------------------------------
const getTeacherClassSubject = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const rows = [];
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (p.teacher && p.subject && !p.isBreak) {
            const tName = staffName(p.teacher);
            const cls = `${t.class}-${t.section}`;
            const existing = rows.find(
              r => r.classSection === cls && r.subject === p.subject && r.teacherName === tName
            );
            if (existing) existing.period++;
            else rows.push({ classSection: cls, subject: p.subject, teacherName: tName, period: 1, resource: '-' });
          }
        });
      });
    });
    res.json(rows.map((r, i) => ({ sn: i + 1, ...r })));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/subject-taught
// ----------------------------------------------------------------
const getSubjectTaught = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const map = new Map();
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (p.teacher && p.subject && !p.isBreak) {
            const key = `${p.teacher._id}-${t.class}-${t.section}`;
            if (!map.has(key)) {
              map.set(key, {
                teacherName: staffName(p.teacher),
                classSection: `${t.class}-${t.section}`,
                subject: p.subject
              });
            }
          }
        });
      });
    });
    const data = Array.from(map.values()).map((r, i) => ({ sn: i + 1, ...r }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/class-teachers
// ----------------------------------------------------------------
const getClassTeachers = async (req, res) => {
  try {
    const [timetables, staff] = await Promise.all([
      Timetable.find({}, 'class section'),
      Staff.find({}, 'firstName lastName contactNo').sort('firstName')
    ]);
    const data = timetables.map((t, idx) => {
      const s = staff[idx % staff.length];
      return {
        sn: idx + 1,
        className: t.class,
        section: t.section,
        teacherName: s ? staffName(s) : '—',
        roomNo: `R-${101 + (idx % 25)}`,
        mobileNo: s?.contactNo || '—'
      };
    });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/wing-wise-teachers
// ----------------------------------------------------------------
const getWingWiseTeachers = async (req, res) => {
  try {
    const staff = await Staff.find({}, 'firstName lastName contactNo gender wing').sort('firstName');
    const data = staff.map((s, i) => ({
      sn: i + 1,
      name: staffName(s),
      contact: s.contactNo || '—',
      gender: s.gender || '—',
      wing: s.wing || '—'
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/subject-wise-teachers
// ----------------------------------------------------------------
const getSubjectWiseTeachers = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const map = new Map();
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (p.teacher && p.subject && !p.isBreak) {
            const key = `${p.subject}-${p.teacher._id}`;
            if (!map.has(key)) {
              map.set(key, {
                subjectName: p.subject,
                teacherName: staffName(p.teacher),
                contact: p.teacher.contactNo || '—',
                designation: p.teacher.designation || '—'
              });
            }
          }
        });
      });
    });
    const data = Array.from(map.values()).map((r, i) => ({ sn: i + 1, ...r }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/date-wise-substitution?from=&to=
// ----------------------------------------------------------------
const getDateWiseSubstitution = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    const subs = await TimetableSubstitution.find(query)
      .populate('absentTeacherId', 'firstName lastName')
      .populate('substituteTeacherId', 'firstName lastName')
      .sort('date');
    const data = subs.map((s, i) => ({
      sn: i + 1,
      date: s.date ? new Date(s.date).toLocaleDateString('en-GB') : '—',
      day: s.day || '—',
      absentTeacher: staffName(s.absentTeacherId),
      period: s.period || '—',
      classSubject: s.classSubject || '—',
      substituteBy: staffName(s.substituteTeacherId),
      wing: s.wing || '—'
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/teacher-workload
// ----------------------------------------------------------------
const getTeacherWorkload = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const map = new Map();
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (p.teacher && !p.isBreak) {
            const tid = p.teacher._id.toString();
            if (!map.has(tid)) {
              map.set(tid, { teacherName: staffName(p.teacher), totalPeriods: 0, classes: new Set() });
            }
            const entry = map.get(tid);
            entry.totalPeriods++;
            entry.classes.add(`${t.class}-${t.section}`);
          }
        });
      });
    });
    const data = Array.from(map.values()).map((r, i) => ({
      sn: i + 1,
      teacherName: r.teacherName,
      totalPeriods: r.totalPeriods,
      classesCount: r.classes.size
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/free-teachers?period=
// ----------------------------------------------------------------
const getFreeTeachers = async (req, res) => {
  try {
    const { period } = req.query;
    const [allStaff, timetables] = await Promise.all([
      Staff.find({}, 'firstName lastName'),
      getAllTimetables()
    ]);
    const busyIds = new Set();
    if (period) {
      timetables.forEach(t => {
        (t.schedule || []).forEach(day => {
          (day.periods || []).forEach(p => {
            if (p.periodName === period && p.teacher && !p.isBreak) {
              busyIds.add(p.teacher._id.toString());
            }
          });
        });
      });
    }
    const data = allStaff
      .filter(s => !busyIds.has(s._id.toString()))
      .map((s, i) => ({ sn: i + 1, teacherName: staffName(s) }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/class-timetable?class=&section=
// ----------------------------------------------------------------
const getClassTimetableReport = async (req, res) => {
  try {
    const { class: className, section } = req.query;
    const query = {};
    if (className && className !== 'All') query.class = className;
    if (section && section !== 'All') query.section = section;
    const timetables = await Timetable.find(query)
      .populate('schedule.periods.teacher', 'firstName lastName');
    res.json(timetables);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/teacher-timetable?teacherName=
// ----------------------------------------------------------------
const getTeacherTimetableReport = async (req, res) => {
  try {
    const { teacherName } = req.query;
    if (!teacherName) return res.status(400).json({ message: 'Teacher name is required' });
    
    const timetables = await getAllTimetables();
    
    // We mock a schedule array for the teacher similar to how class schedule is returned
    const teacherSchedule = { schedule: [] };
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => {
      const daySchedule = { day, periods: [] };
      timetables.forEach(t => {
        const tDay = (t.schedule || []).find(d => d.day === day);
        if (tDay) {
          tDay.periods.forEach(p => {
            if (p.teacher && staffName(p.teacher) === teacherName && !p.isBreak) {
               daySchedule.periods.push({
                 periodName: p.periodName,
                 startTime: p.startTime,
                 endTime: p.endTime,
                 subject: `${p.subject} (${t.class}-${t.section})`,
                 isBreak: false
               });
            } else if (p.isBreak && daySchedule.periods.length > 0 && daySchedule.periods[daySchedule.periods.length - 1].periodName !== p.periodName) {
               const hasBreak = daySchedule.periods.some(bp => bp.isBreak && bp.periodName === p.periodName);
               if(!hasBreak) {
                  daySchedule.periods.push({
                    periodName: p.periodName,
                    startTime: p.startTime,
                    endTime: p.endTime,
                    isBreak: true
                  });
               }
            }
          });
        }
      });
      daySchedule.periods.sort((a,b) => a.startTime.localeCompare(b.startTime));
      teacherSchedule.schedule.push(daySchedule);
    });
    
    res.json([teacherSchedule]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/timetable-logs
// ----------------------------------------------------------------
const getTimetableLogs = async (req, res) => {
  try {
    const timetables = await Timetable.find({}).sort({ updatedAt: -1 }).limit(100);
    const logsMap = new Map();
    timetables.forEach(t => {
      const dateStr = t.updatedAt ? new Date(t.updatedAt).toLocaleString('en-GB') : '—';
      if (!logsMap.has(dateStr)) {
        logsMap.set(dateStr, { generateTime: dateStr, classes: new Set() });
      }
      logsMap.get(dateStr).classes.add(`${t.class}-${t.section}`);
    });
    
    const data = Array.from(logsMap.values()).map((log, i) => ({
      sn: i + 1,
      generateTime: log.generateTime,
      classesAffected: Array.from(log.classes).join(', ')
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/parallel-allocations
// ----------------------------------------------------------------
const getParallelAllocationsReport = async (req, res) => {
  try {
    const allocs = await TimetableParallelAllocation.find()
      .populate('allocations.subject1')
      .populate('allocations.subject2');
    
    const data = allocs.map((a, i) => ({
      sn: i + 1,
      classSection: `${a.class}-${a.section}`,
      allocations: (a.allocations || []).map(al => `${al.subject1?.name || '-'} & ${al.subject2?.name || '-'}`).join(' | ')
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/consecutive-allocations
// ----------------------------------------------------------------
const getConsecutiveAllocationsReport = async (req, res) => {
  try {
    const allocs = await TimetableConsecutiveAllocation.find().populate('subject');
    const data = allocs.map((a, i) => ({
      sn: i + 1,
      classSection: `${a.class}-${a.section}`,
      subject: a.subject?.name || '—',
      consecutivePeriods: a.consecutivePeriods || '—'
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/resource-timetable?resourceName=
// ----------------------------------------------------------------
const getResourceTimetableReport = async (req, res) => {
  try {
    res.json([]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/class-resource
// ----------------------------------------------------------------
const getClassResourceReport = async (req, res) => {
  try {
    res.json([]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/unallocated-periods
// ----------------------------------------------------------------
const getUnallocatedPeriodsReport = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const rows = [];
    let sn = 1;
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (!p.isBreak && (!p.teacher || !p.subject)) {
             rows.push({
               sn: sn++,
               classSection: `${t.class}-${t.section}`,
               day: day.day,
               period: p.periodName,
               status: 'Unallocated'
             });
          }
        });
      });
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/class-wise-teacher-allocation
// ----------------------------------------------------------------
const getClassWiseTeacherAllocation = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const data = timetables.map((t, i) => {
       const teachers = new Set();
       (t.schedule || []).forEach(day => {
         (day.periods || []).forEach(p => {
           if (p.teacher && !p.isBreak) teachers.add(staffName(p.teacher));
         });
       });
       return {
         sn: i + 1,
         classSection: `${t.class}-${t.section}`,
         totalTeachers: teachers.size,
         teachers: Array.from(teachers).join(', ')
       };
    });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/assignment-status
// ----------------------------------------------------------------
const getAssignmentStatus = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const data = timetables.map((t, i) => {
       let total = 0, assigned = 0;
       (t.schedule || []).forEach(day => {
         (day.periods || []).forEach(p => {
           if (!p.isBreak) {
              total++;
              if (p.teacher && p.subject) assigned++;
           }
         });
       });
       return {
         sn: i + 1,
         classSection: `${t.class}-${t.section}`,
         totalPeriods: total,
         assignedPeriods: assigned,
         unassignedPeriods: total - assigned
       };
    });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/subject-summary
// ----------------------------------------------------------------
const getSubjectSummary = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const map = new Map();
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (!p.isBreak && p.subject) {
             if (!map.has(p.subject)) map.set(p.subject, { count: 0, teachers: new Set() });
             const s = map.get(p.subject);
             s.count++;
             if (p.teacher) s.teachers.add(staffName(p.teacher));
          }
        });
      });
    });
    const data = Array.from(map.entries()).map(([subj, val], i) => ({
      sn: i + 1,
      subjectName: subj,
      totalPeriods: val.count,
      teachersAllocated: val.teachers.size
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/subject-wise-teacher-allocation
// ----------------------------------------------------------------
const getSubjectWiseTeacherAllocation = async (req, res) => {
  try {
    const timetables = await getAllTimetables();
    const map = new Map();
    timetables.forEach(t => {
      (t.schedule || []).forEach(day => {
        (day.periods || []).forEach(p => {
          if (!p.isBreak && p.subject && p.teacher) {
             const tName = staffName(p.teacher);
             const key = `${p.subject}-${tName}`;
             if (!map.has(key)) map.set(key, { subject: p.subject, teacher: tName, classes: new Set(), periods: 0 });
             const s = map.get(key);
             s.classes.add(`${t.class}-${t.section}`);
             s.periods++;
          }
        });
      });
    });
    const data = Array.from(map.values()).map((val, i) => ({
      sn: i + 1,
      subjectName: val.subject,
      teacherName: val.teacher,
      classSection: Array.from(val.classes).join(', '),
      periodsPerWeek: val.periods
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ----------------------------------------------------------------
// GET /api/timetable-reports/timetable-at-glance
// ----------------------------------------------------------------
const getTimetableAtGlance = async (req, res) => {
  try {
    res.json([]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = {
  getReportFilters,
  getClassList,
  getSubjectList,
  getTeacherClassSubject,
  getSubjectTaught,
  getClassTeachers,
  getWingWiseTeachers,
  getSubjectWiseTeachers,
  getDateWiseSubstitution,
  getTeacherWorkload,
  getFreeTeachers,
  getClassTimetableReport,
  getTeacherTimetableReport,
  getTimetableLogs,
  getParallelAllocationsReport,
  getConsecutiveAllocationsReport,
  getResourceTimetableReport,
  getClassResourceReport,
  getUnallocatedPeriodsReport,
  getClassWiseTeacherAllocation,
  getAssignmentStatus,
  getSubjectSummary,
  getSubjectWiseTeacherAllocation,
  getTimetableAtGlance
};
