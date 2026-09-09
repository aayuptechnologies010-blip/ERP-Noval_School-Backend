const mongoose = require("mongoose");

// 1. Magazine
const magazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  session: { type: String },
  publishDate: { type: Date, required: true },
  coverImage: { type: String }, // Base64
  attachment: { type: String }, // Base64 PDF
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 2. Homepage Slider
const homepageSliderSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String, required: true }, // Base64
  displayOrder: { type: Number, default: 0 },
  link: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 3. Career
const careerSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobRole: { type: String },
  experience: { type: String },
  skills: { type: String },
  qualification: { type: String },
  ageLimit: { type: String },
  noOfPosts: { type: String },
  description: { type: String },
  activationDate: { type: Date },
  deactivationDate: { type: Date },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 4. Upload TC
const uploadTcSchema = new mongoose.Schema({
  certificateType: { type: String, required: true },
  academicYear: { type: String },
  className: { type: String },
  admissionNo: { type: String },
  studentName: { type: String, required: true },
  certificateNo: { type: String },
  file: { type: String, required: true }, // Base64 for the PDF/Image
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 5. Holiday Homework
const holidayHomeworkSchema = new mongoose.Schema({
  date: { type: Date },
  type: { type: String },
  subject: { type: String },
  classNames: [{ type: String }],
  file: { type: String, required: true }, // Base64
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 6. Website Toppers
const websiteTopperSchema = new mongoose.Schema({
  academicYear: { type: String },
  className: { type: String, required: true },
  studentName: { type: String, required: true },
  showIn: { type: String },
  percentage: { type: String },
  stream: { type: String },
  displayOrder: { type: Number, default: 0 },
  photo: { type: String }, // Base64
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 7. Photos on Homepage
const photosHomepageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photo: { type: String, required: true }, // Base64
  displayOrder: { type: Number, default: 0 },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 8. Website Thoughts
const websiteThoughtSchema = new mongoose.Schema({
  thought: { type: String, required: true },
  author: { type: String },
  activationDate: { type: Date },
  deactivationDate: { type: Date },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 9. Mandatory Disclosure
const mandatoryDisclosureSchema = new mongoose.Schema({
  generalInfo: { type: Object, default: {} },
  documents: { type: Object, default: {} },
  resultsClassX: { type: Array, default: [] },
  resultsClassXII: { type: Array, default: [] },
  staffDetails: { type: Object, default: {} },
  specialEducators: { type: Array, default: [] },
  counsellors: { type: Array, default: [] },
  wellnessTeachers: { type: Array, default: [] },
  infrastructure: { type: Object, default: {} },
  vitalInfo: { type: Object, default: {} },
  docTitle: { type: String },
  category: { type: String },
  attachment: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true, strict: false });

// 10. Staff Visibility
const staffVisibilitySchema = new mongoose.Schema({
  type: { type: String, default: "designation" }, // "designation" or "staff"
  designations: { type: Array, default: [] },
  staffList: { type: Array, default: [] },
  staffName: { type: String },
  designation: { type: String },
  photo: { type: String },
  isVisible: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

// 11. E-Bulletin
const eBulletinSchema = new mongoose.Schema({
  monthName: { type: String, required: true },
  session: { type: String, default: "2024-2025" },
  publishDate: { type: Date, required: true },
  attachment: { type: String, required: true }, // Base64
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 12. e-Diary
const eDiarySchema = new mongoose.Schema({
  sessionName: { type: String, required: true },
  file: { type: String, required: true }, // Base64 or URL
  fileName: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 13. Feedback - Subject Class Relation
const feedbackSubjectClassSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subjectName: { type: String, required: true },
  subjectCode: { type: String },
  isEnabled: { type: Boolean, default: true },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 14. Feedback - Subject Teacher Relation
const feedbackSubjectTeacherSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subjectName: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherId: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 15. Feedback - Question Master
const feedbackQuestionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  type: { type: String, default: "Rating 1-5" }, // Rating 1-5, Yes/No, Descriptive
  status: { type: String, default: "Active" }
}, { timestamps: true });

// 16. Feedback - Template / Form
const feedbackTemplateSchema = new mongoose.Schema({
  formName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: "Active" }, // Active, Closed, Draft
  totalQuestions: { type: Number, default: 0 },
  questions: [{ type: String }],
  applyTo: { type: String, default: "All Students" },
  responseCount: { type: Number, default: 0 },
  webLink: { type: String }
}, { timestamps: true });

module.exports = {
  Magazine: mongoose.model("Magazine", magazineSchema),
  HomepageSlider: mongoose.model("HomepageSlider", homepageSliderSchema),
  Career: mongoose.model("Career", careerSchema),
  UploadTC: mongoose.model("UploadTC", uploadTcSchema),
  HolidayHomework: mongoose.model("HolidayHomework", holidayHomeworkSchema),
  WebsiteTopper: mongoose.model("WebsiteTopper", websiteTopperSchema),
  PhotosHomepage: mongoose.model("PhotosHomepage", photosHomepageSchema),
  WebsiteThought: mongoose.model("WebsiteThought", websiteThoughtSchema),
  MandatoryDisclosure: mongoose.model("MandatoryDisclosure", mandatoryDisclosureSchema),
  StaffVisibility: mongoose.model("StaffVisibility", staffVisibilitySchema),
  EBulletin: mongoose.model("EBulletin", eBulletinSchema),
  EDiary: mongoose.model("EDiary", eDiarySchema),
  FeedbackSubjectClass: mongoose.model("FeedbackSubjectClass", feedbackSubjectClassSchema),
  FeedbackSubjectTeacher: mongoose.model("FeedbackSubjectTeacher", feedbackSubjectTeacherSchema),
  FeedbackQuestion: mongoose.model("FeedbackQuestion", feedbackQuestionSchema),
  FeedbackTemplate: mongoose.model("FeedbackTemplate", feedbackTemplateSchema)
};
