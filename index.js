require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://erp-noval-school.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows images to be accessed from other origins
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/staffs', require('./routes/staffRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave-requests', require('./routes/leaveRequestRoutes'));
app.use('/api/staff-leaves', require('./routes/staffLeaveRoutes'));
app.use('/api/staff-attendance', require('./routes/staffAttendanceRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/timetables', require('./routes/timetableRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/syllabus', require('./routes/syllabusRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/specified-messages', require('./routes/specifiedMessageRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/class-notices', require('./routes/classNoticeRoutes'));
app.use('/api/staff-notices', require('./routes/staffNoticeRoutes'));
app.use('/api/circulars', require('./routes/circularRoutes'));
app.use('/api/sms', require('./routes/smsRoutes'));
app.use('/api/specified-sms', require('./routes/specifiedSmsRoutes'));
app.use('/api/credentials', require('./routes/credentialsRoutes'));
app.use('/api/teacher-observations', require('./routes/teacherObservationRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/payslips', require('./routes/payslipRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/ebooks', require('./routes/ebookRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/questionnaires', require('./routes/questionnaireRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
