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
  'https://erp-noval-school.vercel.app', // Fixed old domain (origin should not contain paths like /login)
  'https://erp-noval-school-1acey25x7-aayuptechnologies010-blips-projects.vercel.app' // Aapka Naya Vercel Domain
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api/lesson-plans', require('./routes/lessonPlanRoutes'));
app.use('/api/timetables', require('./routes/timetableRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/surveys', require('./routes/surveyRoutes'));
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
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/thoughts', require('./routes/thoughtRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/appreciations', require('./routes/appreciationRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/student-appreciations', require('./routes/studentAppreciationRoutes'));
app.use('/api/staff-appreciations', require('./routes/staffAppreciationRoutes'));
app.use('/api/infractions', require('./routes/infractionRoutes'));
app.use('/api/consequences', require('./routes/consequenceRoutes'));
app.use('/api/student-infractions', require('./routes/studentInfractionRoutes'));
app.use('/api/staff-infractions', require('./routes/staffInfractionRoutes'));
app.use('/api/question-papers', require('./routes/questionPaperRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/banks', require('./routes/bankRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/professions', require('./routes/professionRoutes'));
app.use('/api/academic-years', require('./routes/academicYearRoutes'));
app.use('/api/financial-years', require('./routes/financialYearRoutes'));
app.use('/api/castes', require('./routes/casteRoutes'));
app.use('/api/sub-castes', require('./routes/subCasteRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/parishes', require('./routes/parishRoutes'));
app.use('/api/religions', require('./routes/religionRoutes'));
app.use('/api/school-classes', require('./routes/schoolClassRoutes'));
app.use('/api/school-global-details', require('./routes/schoolGlobalDetailsRoutes'));
app.use('/api/school-boards', require('./routes/schoolBoardRoutes'));
app.use('/api/school-global-fee-types', require('./routes/schoolGlobalFeeTypeRoutes'));
app.use('/api/wings', require('./routes/wingRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/class-sections', require('./routes/classSectionRoutes'));
app.use('/api/houses', require('./routes/houseRoutes'));
app.use('/api/committees', require('./routes/committeeRoutes'));
app.use('/api/meeting-details', require('./routes/meetingDetailRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/streams', require('./routes/streamRoutes'));
app.use('/api/optional-subjects', require('./routes/optionalSubjectRoutes'));
app.use('/api/parents-statuses', require('./routes/parentsStatusRoutes'));
app.use('/api/student-classifications', require('./routes/studentClassificationRoutes'));
app.use('/api/reasons', require('./routes/reasonRoutes'));
app.use('/api/remarks', require('./routes/remarkRoutes'));
app.use('/api/session-transfer', require('./routes/sessionTransferRoutes'));
app.use('/api/global-search-settings', require('./routes/globalSearchSettingRoutes'));
app.use('/api/change-academic-year', require('./routes/changeAcademicYearRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));

app.use('/api/admission-settings', require('./routes/admissionSettingRoutes'));
app.use('/api/enquiry-no-settings', require('./routes/enquiryNoSettingRoutes'));
app.use('/api/registration-no-settings', require('./routes/registrationNoSettingRoutes'));
app.use('/api/user-permissions', require('./routes/userPermissionRoutes'));
app.use('/api/languages', require('./routes/languageRoutes'));
app.use('/api/castes', require('./routes/casteRoutes'));
app.use('/api/extra-activities', require('./routes/extraActivityRoutes'));
app.use('/api/characters', require('./routes/characterRoutes'));
app.use('/api/promotion-masters', require('./routes/promotionMasterRoutes'));
app.use('/api/last-results', require('./routes/lastResultRoutes'));
app.use('/api/term-masters', require('./routes/termMasterRoutes'));
app.use('/api/mother-tongues', require('./routes/motherTongueRoutes'));
app.use('/api/stationary-details', require('./routes/stationaryDetailsRoutes'));
app.use('/api/tc-settings', require('./routes/tcSettingRoutes'));
app.use('/api/report-layout-settings', require('./routes/reportLayoutSettingRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/prospectus-entries', require('./routes/prospectusEntryRoutes'));
app.use('/api/manual-list-generation', require('./routes/manualListRoutes'));
app.use('/api/slot-creations', require('./routes/slotCreationRoutes'));
app.use('/api/fee-receipt-settings', require('./routes/feeReceiptSettingRoutes'));
app.use('/api/fee-master-settings', require('./routes/feeMasterSettingRoutes'));
app.use('/api/fee-types', require('./routes/feeTypeRoutes'));
app.use('/api/fee-groups', require('./routes/feeGroupRoutes'));
app.use('/api/fee-heads', require('./routes/feeHeadRoutes'));
app.use('/api/fee-installments', require('./routes/feeInstallmentRoutes'));
app.use('/api/expense-heads', require('./routes/expenseHeadRoutes'));
app.use('/api/concession-types', require('./routes/concessionTypeRoutes'));
app.use('/api/concessions', require('./routes/concessionRoutes'));
app.use('/api/fee-group-to-heads', require('./routes/feeGroupToHeadRoutes'));
app.use('/api/fee-amount-groups', require('./routes/feeAmountGroupRoutes'));
app.use('/api/fee-head-concessions', require('./routes/feeHeadConcessionRoutes'));
app.use('/api/fee-transactions', require('./routes/feeTransactionRoutes'));
app.use('/api/security-money', require('./routes/securityMoneyRoutes'));
app.use('/api/student-expenses', require('./routes/studentExpenseRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/fee-reports', require('./routes/feeReportRoutes'));
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
