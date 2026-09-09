const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Staff = require('./models/staffModel');
const SchoolClass = require('./models/schoolClassModel');
const Section = require('./models/sectionModel');
const TimetableGlobalSetting = require('./models/timetableGlobalSettingModel');
const TimetableTeacherSetting = require('./models/timetableTeacherSettingModel');
const TimetableClassSetting = require('./models/timetableClassSettingModel');
const TimetablePeriodSetting = require('./models/timetablePeriodSettingModel');

const seedTimetableData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // 1. Global Setting
    await TimetableGlobalSetting.deleteMany();
    await TimetableGlobalSetting.create({
      staffType: 'Teaching',
      dayCriteria: 'weekday',
      periodStartWith: 'Zero',
      validateBusyCondition: true,
      showClassWisePeriodTime: false,
      isDeleteWithYesNo: true
    });
    console.log('Global Setting seeded!');

    // 2. Teacher Settings (Get up to 5 staff members)
    const staffs = await Staff.find().limit(5);
    await TimetableTeacherSetting.deleteMany();
    
    if (staffs.length > 0) {
      const teacherSettings = staffs.map((staff, index) => ({
        staff: staff._id,
        shortName: `T${index + 1}`,
        maxPeriodsPerWeek: 30 + index
      }));
      await TimetableTeacherSetting.insertMany(teacherSettings);
      console.log(`Seeded ${teacherSettings.length} Teacher Settings!`);
    } else {
      console.log('No staff found. Skipping Teacher Settings.');
    }

    // 3. Class Settings (Get up to 5 class-section combinations)
    const classes = await SchoolClass.find().limit(5);
    const sections = await Section.find().limit(5);
    await TimetableClassSetting.deleteMany();

    if (classes.length > 0 && sections.length > 0) {
      const classSettings = classes.map((cls, index) => ({
        class: cls._id,
        section: sections[index % sections.length]._id,
        weekPeriods: 48,
        periodsPerDay: 8,
        recess1: 4,
        recess2: 6
      }));
      await TimetableClassSetting.insertMany(classSettings);
      console.log(`Seeded ${classSettings.length} Class Settings!`);
    } else {
      console.log('No classes or sections found. Skipping Class Settings.');
    }

    // 4. Period Settings (Seed 5 periods)
    await TimetablePeriodSetting.deleteMany();
    const periodSettings = [
      { periodNumber: 1, startTime: '08:00 AM', endTime: '08:45 AM', isBreak: false },
      { periodNumber: 2, startTime: '08:45 AM', endTime: '09:30 AM', isBreak: false },
      { periodNumber: 3, startTime: '09:30 AM', endTime: '10:15 AM', isBreak: false },
      { periodNumber: 4, startTime: '10:15 AM', endTime: '11:00 AM', isBreak: false },
      { periodNumber: 5, startTime: '11:00 AM', endTime: '11:30 AM', isBreak: true } // Lunch break
    ];
    await TimetablePeriodSetting.insertMany(periodSettings);
    console.log(`Seeded ${periodSettings.length} Period Settings!`);

    console.log('All timetable mock data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedTimetableData();
