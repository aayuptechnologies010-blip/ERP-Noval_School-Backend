const TimetableParallelAllocation = require('../models/timetableParallelAllocationModel');
const TimetableFixedAllocation = require('../models/timetableFixedAllocationModel');
const TimetableConsecutiveAllocation = require('../models/timetableConsecutiveAllocationModel');
const TimetablePreferenceAllocation = require('../models/timetablePreferenceAllocationModel');

// 1. Parallel Allocation
const getParallelAllocations = async (req, res) => {
  try {
    const allocations = await TimetableParallelAllocation.find()
      .populate('allocations.classId', 'name')
      .populate('allocations.subjectId', 'name')
      .populate('allocations.teacherId', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertParallelAllocation = async (req, res) => {
  try {
    const { name, periodsToAllocate, allocations } = req.body;
    let alloc = await TimetableParallelAllocation.findOne({ name });
    if (alloc) {
      alloc.periodsToAllocate = periodsToAllocate;
      alloc.allocations = allocations;
      await alloc.save();
    } else {
      alloc = await TimetableParallelAllocation.create({ name, periodsToAllocate, allocations });
    }
    res.json(alloc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Fixed Allocation
const getFixedAllocations = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;
    let query = {};
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    const allocations = await TimetableFixedAllocation.find(query)
      .populate('subjectId', 'name')
      .populate('teacherId', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertFixedAllocation = async (req, res) => {
  try {
    const { classId, sectionId, subjectId, teacherId, day, periodNo } = req.body;
    let alloc = await TimetableFixedAllocation.findOne({ classId, sectionId, day, periodNo });
    if (alloc) {
      alloc.subjectId = subjectId;
      alloc.teacherId = teacherId;
      await alloc.save();
    } else {
      alloc = await TimetableFixedAllocation.create({ classId, sectionId, subjectId, teacherId, day, periodNo });
    }
    res.json(alloc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Consecutive Allocation
const getConsecutiveAllocations = async (req, res) => {
  try {
    const allocations = await TimetableConsecutiveAllocation.find()
      .populate('allocations.classId', 'name')
      .populate('allocations.subjectId', 'name')
      .populate('allocations.teacherId', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertConsecutiveAllocation = async (req, res) => {
  try {
    const { totalPeriods, frequency, totalSet, allocations, _id } = req.body;
    let alloc;
    if (_id) {
      alloc = await TimetableConsecutiveAllocation.findById(_id);
      if (alloc) {
        alloc.totalPeriods = totalPeriods;
        alloc.frequency = frequency;
        alloc.totalSet = totalSet;
        alloc.allocations = allocations;
        await alloc.save();
      }
    }
    if (!alloc) {
      alloc = await TimetableConsecutiveAllocation.create({ totalPeriods, frequency, totalSet, allocations });
    }
    res.json(alloc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Preference Allocation
const getPreferenceAllocations = async (req, res) => {
  try {
    const allocations = await TimetablePreferenceAllocation.find()
      .populate('classId', 'name')
      .populate('allocations.subjectId', 'name')
      .populate('allocations.teacherId', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertPreferenceAllocation = async (req, res) => {
  try {
    const { classId, allocations } = req.body;
    let alloc = await TimetablePreferenceAllocation.findOne({ classId });
    if (alloc) {
      alloc.allocations = allocations;
      await alloc.save();
    } else {
      alloc = await TimetablePreferenceAllocation.create({ classId, allocations });
    }
    res.json(alloc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getParallelAllocations,
  upsertParallelAllocation,
  getFixedAllocations,
  upsertFixedAllocation,
  getConsecutiveAllocations,
  upsertConsecutiveAllocation,
  getPreferenceAllocations,
  upsertPreferenceAllocation
};
