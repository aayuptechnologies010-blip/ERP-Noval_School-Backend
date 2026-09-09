const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Staff = require('./models/staffModel');
const SchoolClass = require('./models/schoolClassModel');
const Section = require('./models/sectionModel');
const Subject = require('./models/subjectModel');
const Resource = require('./models/resourceModel');

const TimetableClassSubject = require('./models/timetableClassSubjectModel');
const TimetablePeriodAllotment = require('./models/timetablePeriodAllotmentModel');
const TimetableResourceSubject = require('./models/timetableResourceSubjectModel');
const TimetableClassTeacher = require('./models/timetableClassTeacherModel');
const TimetableClassTeacherSubject = require('./models/timetableClassTeacherSubjectModel');

const seedPhase3 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // 1. Seed Subjects
    await Subject.deleteMany();
    const subjectsToInsert = [
      { name: 'ENGLISH CORE', code: 'ENG' },
      { name: 'HINDI CORE', code: 'HIN' },
      { name: 'MATHEMATICS', code: 'MATH' },
      { name: 'PHYSICS', code: 'PHY' },
      { name: 'CHEMISTRY', code: 'CHEM' },
      { name: 'BIOLOGY', code: 'BIO' }
    ];
    const insertedSubjects = await Subject.insertMany(subjectsToInsert);
    console.log('Subjects seeded:', insertedSubjects.length);

    // 2. Seed Resources
    await Resource.deleteMany();
    const resourcesToInsert = [
      { name: 'Physics Lab', type: 'Lab', capacity: 40 },
      { name: 'Chemistry Lab', type: 'Lab', capacity: 40 },
      { name: 'Computer Lab', type: 'Lab', capacity: 50 },
      { name: 'Library', type: 'Room', capacity: 100 }
    ];
    const insertedResources = await Resource.insertMany(resourcesToInsert);
    console.log('Resources seeded:', insertedResources.length);

    // Fetch necessary references
    const staffs = await Staff.find().limit(5);
    const classes = await SchoolClass.find().limit(5);
    const sections = await Section.find().limit(5);

    if (classes.length === 0 || sections.length === 0 || staffs.length === 0) {
      console.log('Missing basic data (staff, classes, sections) to seed relation models. Exiting.');
      process.exit(1);
    }

    // 3. Seed Class Subjects
    await TimetableClassSubject.deleteMany();
    const classSubjectsToInsert = classes.map((cls, index) => ({
      class: cls._id,
      section: sections[index % sections.length]._id,
      subjects: insertedSubjects.map((sub, i) => ({
        subject: sub._id,
        periods: 6 + (i % 2),
        order: i + 1
      }))
    }));
    await TimetableClassSubject.insertMany(classSubjectsToInsert);
    console.log('Class Subjects seeded:', classSubjectsToInsert.length);

    // 4. Seed Period Allotment
    await TimetablePeriodAllotment.deleteMany();
    const allotments = [];
    for (let i = 0; i < classes.length; i++) {
      for (let j = 0; j < 3; j++) { // assign 3 subjects per class
        allotments.push({
          class: classes[i]._id,
          section: sections[i % sections.length]._id,
          subject: insertedSubjects[j]._id,
          teacher: staffs[j % staffs.length]._id,
          periods: 6
        });
      }
    }
    await TimetablePeriodAllotment.insertMany(allotments);
    console.log('Period Allotments seeded:', allotments.length);

    // 5. Seed Resource Subjects
    await TimetableResourceSubject.deleteMany();
    const resourceSubjects = [
      {
        resource: insertedResources[0]._id, // Physics Lab
        class: classes[0]._id,
        section: sections[0]._id,
        subjects: [insertedSubjects.find(s => s.name === 'PHYSICS')._id]
      },
      {
        resource: insertedResources[1]._id, // Chemistry Lab
        class: classes[0]._id,
        section: sections[0]._id,
        subjects: [insertedSubjects.find(s => s.name === 'CHEMISTRY')._id]
      }
    ];
    await TimetableResourceSubject.insertMany(resourceSubjects);
    console.log('Resource Subjects seeded:', resourceSubjects.length);

    // 6. Seed Class Teachers
    await TimetableClassTeacher.deleteMany();
    const classTeachers = classes.map((cls, index) => ({
      class: cls._id,
      section: sections[index % sections.length]._id,
      classTeacher: staffs[index % staffs.length]._id,
      assistantTeacher: staffs[(index + 1) % staffs.length]._id
    }));
    await TimetableClassTeacher.insertMany(classTeachers);
    console.log('Class Teachers seeded:', classTeachers.length);

    // 7. Seed Class Teacher Subjects
    await TimetableClassTeacherSubject.deleteMany();
    const classTeacherSubjects = classTeachers.map((ct, index) => ({
      classTeacher: ct.classTeacher,
      class: ct.class,
      section: ct.section,
      subject: insertedSubjects[index % insertedSubjects.length]._id
    }));
    await TimetableClassTeacherSubject.insertMany(classTeacherSubjects);
    console.log('Class Teacher Subjects seeded:', classTeacherSubjects.length);

    console.log('Phase 3 mock data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding phase 3:', error);
    process.exit(1);
  }
};

seedPhase3();
