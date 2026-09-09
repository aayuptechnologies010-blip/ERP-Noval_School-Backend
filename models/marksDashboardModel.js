const mongoose = require('mongoose');

// Marks Manager Dashboard Aggregated Stats Schema
const marksDashboardConfigSchema = new mongoose.Schema({
  academicYear: { type: String, default: "2026-2027" },
  
  // Top 3 Stat Cards
  marksEntryStatus: {
    locked: { type: Number, default: 45 },
    inProgress: { type: Number, default: 35 },
    pending: { type: Number, default: 20 }
  },
  modifiedEntries: {
    teachersCount: { type: Number, default: 12 },
    entriesModifiedPercent: { type: Number, default: 8.5 }
  },
  passFailRatio: {
    passPercent: { type: Number, default: 94.2 },
    failPercent: { type: Number, default: 5.8 }
  },

  // Performance Data per standard / class
  performanceData: [{
    standard: { type: String, required: true },
    prevYear: { type: Number, default: 80 },
    currYear: { type: Number, default: 85 },
    highest: { type: Number, default: 98 }
  }],

  // Top Student Highlights
  overallTopper: {
    name: { type: String, default: "Aarav Sharma" },
    standard: { type: String, default: "Class X-A" },
    rollNo: { type: String, default: "101" },
    percentage: { type: String, default: "99.4%" },
    marks: { type: String, default: "497 / 500" },
    schoolName: { type: String, default: "Navals National Academy" }
  },

  topStudentsList: [{
    rank: { type: Number },
    name: { type: String },
    standard: { type: String },
    percentage: { type: String },
    marks: { type: String },
    avatarColor: { type: String, default: "bg-amber-500" }
  }],

  // Subject-wise comparison data
  subjectComparisonData: [{
    subject: { type: String, required: true },
    passRate: { type: Number, default: 95 },
    avgMarks: { type: Number, default: 82 }
  }]
}, { timestamps: true });

const MarksDashboardConfig = mongoose.model('MarksDashboardConfig', marksDashboardConfigSchema);

module.exports = MarksDashboardConfig;
