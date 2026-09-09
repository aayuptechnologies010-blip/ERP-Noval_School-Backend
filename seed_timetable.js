/**
 * Seed timetable data using real Staff IDs from MongoDB.
 * Run: node seed_timetable.js  (from the backend folder)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Timetable = require('./models/timetableModel');
const Staff = require('./models/staffModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const allStaff = await Staff.find({}).select('firstName lastName').lean();
  if (allStaff.length === 0) {
    console.error('No staff found in DB. Please add teachers first.');
    process.exit(1);
  }

  console.log(`Found ${allStaff.length} staff members:`);
  allStaff.forEach((s, i) => console.log(`  ${i}: ${s.firstName} ${s.lastName} - ${s._id}`));

  // Use actual staff IDs (cycle through available ones)
  const getTeacher = (idx) => allStaff[idx % allStaff.length]._id;

  function makePeriod(periodName, subject, teacherIdx, startTime, endTime, isBreak = false) {
    return {
      periodName,
      startTime,
      endTime,
      isBreak,
      subject: isBreak ? '' : subject,
      teacher: isBreak ? null : getTeacher(teacherIdx)
    };
  }

  const timetables = [
    {
      class: '10',
      section: 'A',
      schedule: [
        {
          day: 'Monday',
          periods: [
            makePeriod('1st Period', 'English', 0, '08:00', '08:45'),
            makePeriod('2nd Period', 'Mathematics', 1, '08:45', '09:30'),
            makePeriod('3rd Period', 'Science', 2, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Hindi', 3, '10:30', '11:15'),
            makePeriod('5th Period', 'Social Studies', 4, '11:15', '12:00'),
            makePeriod('6th Period', 'English', 0, '12:00', '12:45'),
          ]
        },
        {
          day: 'Tuesday',
          periods: [
            makePeriod('1st Period', 'Mathematics', 1, '08:00', '08:45'),
            makePeriod('2nd Period', 'Science', 2, '08:45', '09:30'),
            makePeriod('3rd Period', 'Hindi', 3, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'English', 0, '10:30', '11:15'),
            makePeriod('5th Period', 'Computer', 5, '11:15', '12:00'),
            makePeriod('6th Period', 'Art', 6, '12:00', '12:45'),
          ]
        },
        {
          day: 'Wednesday',
          periods: [
            makePeriod('1st Period', 'Science', 2, '08:00', '08:45'),
            makePeriod('2nd Period', 'Mathematics', 1, '08:45', '09:30'),
            makePeriod('3rd Period', 'English', 0, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Social Studies', 4, '10:30', '11:15'),
            makePeriod('5th Period', 'Hindi', 3, '11:15', '12:00'),
            makePeriod('6th Period', 'Computer', 5, '12:00', '12:45'),
          ]
        },
        {
          day: 'Thursday',
          periods: [
            makePeriod('1st Period', 'English', 0, '08:00', '08:45'),
            makePeriod('2nd Period', 'Hindi', 3, '08:45', '09:30'),
            makePeriod('3rd Period', 'Mathematics', 1, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Science', 2, '10:30', '11:15'),
            makePeriod('5th Period', 'Art', 6, '11:15', '12:00'),
            makePeriod('6th Period', 'Social Studies', 4, '12:00', '12:45'),
          ]
        },
        {
          day: 'Friday',
          periods: [
            makePeriod('1st Period', 'Mathematics', 1, '08:00', '08:45'),
            makePeriod('2nd Period', 'English', 0, '08:45', '09:30'),
            makePeriod('3rd Period', 'Computer', 5, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Science', 2, '10:30', '11:15'),
            makePeriod('5th Period', 'Hindi', 3, '11:15', '12:00'),
            makePeriod('6th Period', 'Mathematics', 1, '12:00', '12:45'),
          ]
        },
        {
          day: 'Saturday',
          periods: [
            makePeriod('1st Period', 'Hindi', 3, '08:00', '08:45'),
            makePeriod('2nd Period', 'Social Studies', 4, '08:45', '09:30'),
            makePeriod('3rd Period', 'English', 0, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Mathematics', 1, '10:30', '11:15'),
            makePeriod('5th Period', 'Art', 6, '11:15', '12:00'),
          ]
        }
      ]
    },
    {
      class: '9',
      section: 'B',
      schedule: [
        {
          day: 'Monday',
          periods: [
            makePeriod('1st Period', 'Physics', 4, '08:00', '08:45'),
            makePeriod('2nd Period', 'Chemistry', 5, '08:45', '09:30'),
            makePeriod('3rd Period', 'Mathematics', 1, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'English', 0, '10:30', '11:15'),
            makePeriod('5th Period', 'Biology', 6, '11:15', '12:00'),
          ]
        },
        {
          day: 'Tuesday',
          periods: [
            makePeriod('1st Period', 'English', 0, '08:00', '08:45'),
            makePeriod('2nd Period', 'Mathematics', 1, '08:45', '09:30'),
            makePeriod('3rd Period', 'Physics', 4, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Hindi', 3, '10:30', '11:15'),
            makePeriod('5th Period', 'Chemistry', 5, '11:15', '12:00'),
          ]
        },
        {
          day: 'Wednesday',
          periods: [
            makePeriod('1st Period', 'Hindi', 3, '08:00', '08:45'),
            makePeriod('2nd Period', 'Biology', 6, '08:45', '09:30'),
            makePeriod('3rd Period', 'English', 0, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Mathematics', 1, '10:30', '11:15'),
            makePeriod('5th Period', 'Physics', 4, '11:15', '12:00'),
          ]
        },
        {
          day: 'Thursday',
          periods: [
            makePeriod('1st Period', 'Chemistry', 5, '08:00', '08:45'),
            makePeriod('2nd Period', 'Mathematics', 1, '08:45', '09:30'),
            makePeriod('3rd Period', 'Biology', 6, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Physics', 4, '10:30', '11:15'),
            makePeriod('5th Period', 'English', 0, '11:15', '12:00'),
          ]
        },
        {
          day: 'Friday',
          periods: [
            makePeriod('1st Period', 'Mathematics', 1, '08:00', '08:45'),
            makePeriod('2nd Period', 'Hindi', 3, '08:45', '09:30'),
            makePeriod('3rd Period', 'Chemistry', 5, '09:30', '10:15'),
            makePeriod('Break', '', 0, '10:15', '10:30', true),
            makePeriod('4th Period', 'Biology', 6, '10:30', '11:15'),
            makePeriod('5th Period', 'English', 0, '11:15', '12:00'),
          ]
        }
      ]
    }
  ];

  for (const tt of timetables) {
    await Timetable.deleteOne({ class: tt.class, section: tt.section });
    const doc = await Timetable.create(tt);
    console.log(`✅ Created timetable for Class ${tt.class}-${tt.section} [${doc._id}]`);
  }

  // Verify dashboard stats manually
  console.log('\n=== Verification ===');
  const allTimetables = await Timetable.find().populate('schedule.periods.teacher', 'firstName lastName').lean();
  const teacherMap = new Map();
  allTimetables.forEach(t => {
    t.schedule.forEach(day => {
      day.periods.forEach(p => {
        if (p.teacher && !p.isBreak) {
          const name = `${p.teacher.firstName || ''} ${p.teacher.lastName || ''}`.trim();
          if (!teacherMap.has(name)) teacherMap.set(name, 0);
          teacherMap.set(name, teacherMap.get(name) + 1);
        }
      });
    });
  });

  console.log('Teacher workload from seeded data:');
  teacherMap.forEach((count, name) => {
    console.log(`  ${name}: ${count} periods`);
  });

  await mongoose.disconnect();
  console.log('\nDone!');
})();
