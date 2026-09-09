require('dotenv').config();
const mongoose = require('mongoose');
const Album = require('./models/albumModel');
const Video = require('./models/videoModel');
const Notice = require('./models/noticeModel');
const Media = require('./models/mediaModel');
const Achievement = require('./models/achievementModel');
const Event = require('./models/eventModel');
const Sport = require('./models/sportModel');
const Blog = require('./models/blogModel');
const Guestbook = require('./models/guestbookModel');

async function seedWebAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Achievements
    const achCount = await Achievement.countDocuments();
    if (achCount === 0) {
      await Achievement.insertMany([
        {
          title: 'State Level Taekwondo Gold Medalist',
          studentName: 'Aayup Kumar',
          class: 'NUR-A',
          category: 'Sports',
          eventName: 'UP State Sub-Junior Championship',
          date: '15-Aug-2026',
          rank: '1st (Gold)',
          description: 'Secured first position and gold medal representing Navals National Academy.',
          status: 'Active'
        },
        {
          title: 'Inter-School Science Olympiad',
          studentName: 'Arnav Gupta',
          class: 'Class 5-A',
          category: 'Academic',
          eventName: 'National Science Olympiad (NSO)',
          date: '10-Jul-2026',
          rank: '1st (National Rank 12)',
          description: 'Secured top zonal percentile in Mathematics & Science Olympiad.',
          status: 'Active'
        },
        {
          title: 'District Debate Competition Winner',
          studentName: 'Anvi Maurya',
          class: 'Class 8-B',
          category: 'Cultural',
          eventName: 'Mau District Youth Debate Fest',
          date: '02-May-2026',
          rank: 'Winner',
          description: 'Presented an inspiring speech on AI & Ethics in Education.',
          status: 'Active'
        }
      ]);
      console.log('Seeded Achievements.');
    }

    // 2. Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        {
          title: 'Annual Science & Tech Exhibition 2026',
          eventDate: '25-Sep-2026',
          time: '09:30 AM',
          location: 'Main School Auditorium & Quadrangle',
          category: 'Academic',
          description: 'Showcasing innovation and working models crafted by students of Classes 3 to 12.',
          status: 'Upcoming'
        },
        {
          title: 'Grand Parent Teacher Interactive Meeting',
          eventDate: '12-Oct-2026',
          time: '08:30 AM',
          location: 'Navals National Academy Campus',
          category: 'Meeting',
          description: 'Discussion regarding midterm academic performance and holistic development.',
          status: 'Upcoming'
        }
      ]);
      console.log('Seeded Events.');
    }

    // 3. Sports
    const sportCount = await Sport.countDocuments();
    if (sportCount === 0) {
      await Sport.insertMany([
        {
          title: 'Inter-House Annual Cricket Championship',
          sportType: 'Cricket',
          matchDate: '18-Nov-2026',
          teams: 'Blue House vs Red House',
          result: 'Blue House won by 24 runs',
          description: 'Final match of the annual inter-house cricket tournament held at the main sports ground.',
          status: 'Completed'
        },
        {
          title: 'Navals Badminton Super League',
          sportType: 'Badminton',
          matchDate: '05-Dec-2026',
          teams: 'Junior & Senior Categories',
          result: 'Pending Finals',
          description: 'Singles and doubles badminton matches across primary and senior wings.',
          status: 'Active'
        }
      ]);
      console.log('Seeded Sports.');
    }

    // 4. Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: 'Fostering 21st-Century Critical Thinking in Schools',
          author: 'Navals National Academy Faculty',
          category: 'Education',
          content: 'Modern educational methodologies prioritize conceptual clarity and practical problem solving over rote memorization.',
          tags: ['Education', 'Future Skills', 'STEM'],
          status: 'Published'
        },
        {
          title: 'Why Physical Sports & Wellness Matter as Much as Academics',
          author: 'Sports Department',
          category: 'Sports & Health',
          content: 'Active sports participation enhances emotional resilience, leadership qualities, and mental focus in developing children.',
          tags: ['Health', 'Sports', 'Wellness'],
          status: 'Published'
        }
      ]);
      console.log('Seeded Blogs.');
    }

    // 5. Guestbook
    const gbCount = await Guestbook.countDocuments();
    if (gbCount === 0) {
      await Guestbook.insertMany([
        {
          name: 'Sunil Kumar (Parent)',
          email: 'sunil.parent@gmail.com',
          phone: '9876543210',
          message: 'Very impressed with the faculty dedication and the newly renovated digital smart classrooms!',
          rating: 5,
          status: 'Approved'
        },
        {
          name: 'Dr. Anand Verma (Guest Speaker)',
          email: 'anand.verma@edu.org',
          phone: '9888123456',
          message: 'It was a privilege addressing the bright and inquisitive minds at Navals National Academy.',
          rating: 5,
          status: 'Approved'
        }
      ]);
      console.log('Seeded Guestbook.');
    }

    // 6. Check / seed Photo Albums
    const albCount = await Album.countDocuments();
    if (albCount === 0) {
      await Album.insertMany([
        {
          title: 'Annual Sports Day 2026',
          date: '24-Dec-2026',
          description: 'Highlights from track events, drills, and medal distributions.',
          status: 'Active'
        },
        {
          title: 'Science Olympiad & Exhibition',
          date: '10-Jul-2026',
          description: 'Students presenting working robotics and solar energy models.',
          status: 'Active'
        },
        {
          title: 'Independence Day Cultural Gala',
          date: '15-Aug-2026',
          description: 'Patriotic performances, parades, and flag hoisting.',
          status: 'Active'
        },
        {
          title: 'Navals National Academy Annual Function',
          date: '20-Apr-2026',
          description: 'Drama, orchestra, and student award ceremonies.',
          status: 'Active'
        }
      ]);
      console.log('Seeded Photo Albums.');
    }

    // 7. Check / seed Notices
    const notCount = await Notice.countDocuments();
    if (notCount === 0) {
      await Notice.insertMany([
        {
          title: 'Examination & Admit Card Release Notification',
          content: 'Admit cards for upcoming term examinations can now be downloaded or collected from the examination cell.',
          type: 'Notice',
          status: 'Active'
        },
        {
          title: 'School Timing Adjustment during Winter Session',
          content: 'Classes will commence at 08:30 AM and conclude at 02:00 PM starting next week.',
          type: 'Notice',
          status: 'Active'
        }
      ]);
      console.log('Seeded Notices.');
    }

    // 8. Check / seed Videos
    const vidCount = await Video.countDocuments();
    if (vidCount === 0) {
      await Video.insertMany([
        {
          title: 'Navals National Academy Campus Tour & Infrastructure',
          url: 'https://www.youtube.com/watch?v=sample1',
          status: 'Active'
        }
      ]);
      console.log('Seeded Videos.');
    }

    // 9. Check / seed Media
    const medCount = await Media.countDocuments();
    if (medCount === 0) {
      await Media.insertMany([
        {
          title: 'Dainik Jagran Feature: Navals Academy Leads District in CBSE Results',
          fileUrl: 'https://dainikjagran.com/feature',
          type: 'document'
        }
      ]);
      console.log('Seeded Media.');
    }

    console.log('Web Admin data seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedWebAdmin();
