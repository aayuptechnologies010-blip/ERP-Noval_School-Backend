const Subject = require('../models/subjectModel');
const Resource = require('../models/resourceModel');
const TimetableGlobalSetting = require('../models/timetableGlobalSettingModel');
const TimetableTeacherSetting = require('../models/timetableTeacherSettingModel');
const TimetableClassSetting = require('../models/timetableClassSettingModel');
const TimetablePeriodSetting = require('../models/timetablePeriodSettingModel');
const TimetableClassSubject = require('../models/timetableClassSubjectModel');
const TimetablePeriodAllotment = require('../models/timetablePeriodAllotmentModel');
const TimetableResourceSubject = require('../models/timetableResourceSubjectModel');
const TimetableClassTeacher = require('../models/timetableClassTeacherModel');
const TimetableClassTeacherSubject = require('../models/timetableClassTeacherSubjectModel');
const TimetableSubstitutionSetting = require('../models/timetableSubstitutionSettingModel');

// ==========================================
// SUBJECT CONTROLLERS
// ==========================================
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// RESOURCE CONTROLLERS
// ==========================================
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
    res.json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// PHASE 2 CONTROLLERS
// ==========================================

const getGlobalSetting = async (req, res) => {
  try {
    let setting = await TimetableGlobalSetting.findOne();
    if (!setting) {
      setting = await TimetableGlobalSetting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGlobalSetting = async (req, res) => {
  try {
    let setting = await TimetableGlobalSetting.findOne();
    if (!setting) {
      setting = await TimetableGlobalSetting.create(req.body);
    } else {
      setting = await TimetableGlobalSetting.findByIdAndUpdate(setting._id, req.body, { new: true });
    }
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTeacherSettings = async (req, res) => {
  try {
    const settings = await TimetableTeacherSetting.find().populate('staff', 'firstName lastName employeeId');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertTeacherSetting = async (req, res) => {
  try {
    const { staff, shortName, maxPeriodsPerWeek } = req.body;
    let setting = await TimetableTeacherSetting.findOne({ staff });
    if (setting) {
      setting = await TimetableTeacherSetting.findByIdAndUpdate(setting._id, { shortName, maxPeriodsPerWeek }, { new: true });
    } else {
      setting = await TimetableTeacherSetting.create({ staff, shortName, maxPeriodsPerWeek });
    }
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClassSettings = async (req, res) => {
  try {
    const settings = await TimetableClassSetting.find()
      .populate('class', 'className')
      .populate('section', 'sectionName');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertClassSetting = async (req, res) => {
  try {
    const { class: classId, section, weekPeriods, periodsPerDay, recess1, recess2 } = req.body;
    let setting = await TimetableClassSetting.findOne({ class: classId, section });
    if (setting) {
      setting = await TimetableClassSetting.findByIdAndUpdate(setting._id, { weekPeriods, periodsPerDay, recess1, recess2 }, { new: true });
    } else {
      setting = await TimetableClassSetting.create({ class: classId, section, weekPeriods, periodsPerDay, recess1, recess2 });
    }
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPeriodSettings = async (req, res) => {
  try {
    const settings = await TimetablePeriodSetting.find().sort({ periodNumber: 1 });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertPeriodSetting = async (req, res) => {
  try {
    const { periodNumber, startTime, endTime, isBreak } = req.body;
    let setting = await TimetablePeriodSetting.findOne({ periodNumber });
    if (setting) {
      setting = await TimetablePeriodSetting.findByIdAndUpdate(setting._id, { startTime, endTime, isBreak }, { new: true });
    } else {
      setting = await TimetablePeriodSetting.create({ periodNumber, startTime, endTime, isBreak });
    }
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// PHASE 3 CONTROLLERS
// ==========================================

const getClassSubjects = async (req, res) => {
  try {
    const data = await TimetableClassSubject.find().populate('class').populate('section').populate('subjects.subject');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertClassSubjects = async (req, res) => {
  try {
    const { class: classId, section, subjects } = req.body;
    let record = await TimetableClassSubject.findOne({ class: classId, section });
    if (record) {
      record = await TimetableClassSubject.findByIdAndUpdate(record._id, { subjects }, { new: true });
    } else {
      record = await TimetableClassSubject.create({ class: classId, section, subjects });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPeriodAllotments = async (req, res) => {
  try {
    const data = await TimetablePeriodAllotment.find().populate('class').populate('section').populate('subject').populate('teacher');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertPeriodAllotment = async (req, res) => {
  try {
    const { class: classId, section, subject, teacher, periods } = req.body;
    let record = await TimetablePeriodAllotment.findOne({ class: classId, section, subject });
    if (record) {
      record = await TimetablePeriodAllotment.findByIdAndUpdate(record._id, { teacher, periods }, { new: true });
    } else {
      record = await TimetablePeriodAllotment.create({ class: classId, section, subject, teacher, periods });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getResourceSubjects = async (req, res) => {
  try {
    const data = await TimetableResourceSubject.find().populate('resource').populate('class').populate('section').populate('subjects');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertResourceSubject = async (req, res) => {
  try {
    const { resource, class: classId, section, subjects } = req.body;
    let record = await TimetableResourceSubject.findOne({ resource, class: classId, section });
    if (record) {
      record = await TimetableResourceSubject.findByIdAndUpdate(record._id, { subjects }, { new: true });
    } else {
      record = await TimetableResourceSubject.create({ resource, class: classId, section, subjects });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClassTeachers = async (req, res) => {
  try {
    const data = await TimetableClassTeacher.find().populate('class').populate('section').populate('classTeacher').populate('assistantTeacher');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertClassTeacher = async (req, res) => {
  try {
    const { class: classId, section, classTeacher, assistantTeacher } = req.body;
    let record = await TimetableClassTeacher.findOne({ class: classId, section });
    if (record) {
      record = await TimetableClassTeacher.findByIdAndUpdate(record._id, { classTeacher, assistantTeacher }, { new: true });
    } else {
      record = await TimetableClassTeacher.create({ class: classId, section, classTeacher, assistantTeacher });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClassTeacherSubjects = async (req, res) => {
  try {
    const data = await TimetableClassTeacherSubject.find().populate('classTeacher').populate('class').populate('section').populate('subject');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertClassTeacherSubject = async (req, res) => {
  try {
    const { classTeacher, class: classId, section, subject } = req.body;
    let record = await TimetableClassTeacherSubject.findOne({ classTeacher, class: classId, section });
    if (record) {
      record = await TimetableClassTeacherSubject.findByIdAndUpdate(record._id, { subject }, { new: true });
    } else {
      record = await TimetableClassTeacherSubject.create({ classTeacher, class: classId, section, subject });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// SUBSTITUTION SETTING CONTROLLERS
// ==========================================
const getSubstitutionSettings = async (req, res) => {
  try {
    const setting = await TimetableSubstitutionSetting.findOne();
    if (!setting) {
      return res.json({
        patterns: [
          { sno: 1, pattern: "Any subject teacher in whole school", selected: true, orderNo: "1" },
          { sno: 2, pattern: "Same wing with any subject teacher", selected: false, orderNo: "" },
          { sno: 3, pattern: "Same wing with same subject teacher", selected: false, orderNo: "" },
          { sno: 4, pattern: "Same class with any subject teacher", selected: false, orderNo: "" },
          { sno: 5, pattern: "Same wing with maximum free periods", selected: false, orderNo: "" }
        ],
        repeatTeacher: "No"
      });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertSubstitutionSettings = async (req, res) => {
  try {
    const { patterns, repeatTeacher } = req.body;
    let setting = await TimetableSubstitutionSetting.findOne();
    if (setting) {
      setting.patterns = patterns;
      setting.repeatTeacher = repeatTeacher;
      await setting.save();
    } else {
      setting = await TimetableSubstitutionSetting.create({ patterns, repeatTeacher });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getGlobalSetting,
  updateGlobalSetting,
  getTeacherSettings,
  upsertTeacherSetting,
  getClassSettings,
  upsertClassSetting,
  getPeriodSettings,
  upsertPeriodSetting,
  getClassSubjects,
  upsertClassSubjects,
  getPeriodAllotments,
  upsertPeriodAllotment,
  getResourceSubjects,
  upsertResourceSubject,
  getClassTeachers,
  upsertClassTeacher,
  getClassTeacherSubjects,
  upsertClassTeacherSubject,
  getSubstitutionSettings,
  upsertSubstitutionSettings
};
