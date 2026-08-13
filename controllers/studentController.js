const Student = require('../models/studentModel');

// Helper to flatten nested objects for partial updates in Mongoose
const flattenObject = (ob) => {
  let toReturn = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    // Don't flatten arrays or nulls or Date objects
    if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i]) && !(ob[i] instanceof Date)) {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

// Helper to get uploaded file URL
const getFileUrl = (req, fieldName) => {
  if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.files[fieldName][0].filename}`;
  }
  return '';
};

// @desc    Create a new student admission
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    // If the frontend sends the whole data as a JSON string under a 'data' field
    let studentData = req.body;
    if (req.body.data) {
      studentData = JSON.parse(req.body.data);
    }

    // Check if admission number already exists
    const existingStudent = await Student.findOne({ 
      'academicDetails.admissionNumber': studentData.academicDetails?.admissionNumber || studentData.admissionNumber 
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this Admission Number already exists' });
    }

    // Create the student object
    const student = new Student(studentData);

    // Attach image URLs if files were uploaded
    if (req.files) {
      if (req.files.studentPhoto) {
        if (!student.personalDetails) student.personalDetails = {};
        student.personalDetails.studentPhoto = getFileUrl(req, 'studentPhoto');
      }
      if (req.files.fatherPhoto) {
        if (!student.familyDetails) student.familyDetails = {};
        if (!student.familyDetails.father) student.familyDetails.father = {};
        student.familyDetails.father.photo = getFileUrl(req, 'fatherPhoto');
      }
      if (req.files.motherPhoto) {
        if (!student.familyDetails) student.familyDetails = {};
        if (!student.familyDetails.mother) student.familyDetails.mother = {};
        student.familyDetails.mother.photo = getFileUrl(req, 'motherPhoto');
      }
      if (req.files.familyPhoto) {
        if (!student.familyDetails) student.familyDetails = {};
        student.familyDetails.familyPhoto = getFileUrl(req, 'familyPhoto');
      }
    }

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students (with optional filters)
// @route   GET /api/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const { class: studentClass, section } = req.query;
    let query = {};
    
    if (studentClass) {
      query['academicDetails.class'] = studentClass;
    }
    if (section) {
      query['academicDetails.section'] = section;
    }

    const students = await Student.find(query).sort({ 'academicDetails.rollNumber': 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    let studentData = req.body;
    if (req.body.data) {
      studentData = JSON.parse(req.body.data);
    }

    const student = await Student.findById(req.params.id);

    if (student) {
      // Flatten the incoming data so we can update nested fields (like personalDetails.firstName)
      // without overwriting the entire personalDetails object and losing other fields.
      const flatData = flattenObject(studentData);
      student.set(flatData);

      // Update images if new ones are uploaded
      if (req.files) {
        if (req.files.studentPhoto) {
          if (!student.personalDetails) student.personalDetails = {};
          student.personalDetails.studentPhoto = getFileUrl(req, 'studentPhoto');
        }
        if (req.files.fatherPhoto) {
          if (!student.familyDetails) student.familyDetails = {};
          if (!student.familyDetails.father) student.familyDetails.father = {};
          student.familyDetails.father.photo = getFileUrl(req, 'fatherPhoto');
        }
        if (req.files.motherPhoto) {
          if (!student.familyDetails) student.familyDetails = {};
          if (!student.familyDetails.mother) student.familyDetails.mother = {};
          student.familyDetails.mother.photo = getFileUrl(req, 'motherPhoto');
        }
        if (req.files.familyPhoto) {
          if (!student.familyDetails) student.familyDetails = {};
          student.familyDetails.familyPhoto = getFileUrl(req, 'familyPhoto');
        }
      }

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (student) {
      res.json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all favorite students
// @route   GET /api/students/favorites
// @access  Private (Admin)
const getFavoriteStudents = async (req, res) => {
  try {
    const students = await Student.find({ isFavorite: true });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a student's favorite status
// @route   PATCH /api/students/:id/favorite
// @access  Private (Admin)
const toggleStudentFavorite = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.isFavorite = !student.isFavorite;
      const updatedStudent = await student.save();
      res.json({ message: `Student marked as ${updatedStudent.isFavorite ? 'Favorite' : 'Not Favorite'}`, isFavorite: updatedStudent.isFavorite });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update student roll numbers
// @route   PUT /api/students/bulk/roll-numbers
// @access  Private (Admin)
const bulkUpdateRollNumbers = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting [{ studentId: '...', rollNumber: '...' }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of updates in "updates" field.' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.studentId },
        update: { $set: { 'academicDetails.rollNumber': update.rollNumber } }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Student.bulkWrite(bulkOps);
      res.json({ message: 'Roll numbers updated successfully', result });
    } else {
      res.json({ message: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update student house names
// @route   PUT /api/students/bulk/house-names
// @access  Private (Admin)
const bulkUpdateHouseNames = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting [{ studentId: '...', houseName: '...' }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of updates in "updates" field.' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.studentId },
        update: { $set: { 'personalDetails.houseNames': update.houseName } }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Student.bulkWrite(bulkOps);
      res.json({ message: 'House allocations updated successfully', result });
    } else {
      res.json({ message: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update student photos
// @route   PUT /api/students/bulk/photos
// @access  Private (Admin)
const bulkUpdatePhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No photos provided for update' });
    }

    const bulkOps = [];
    
    req.files.forEach(file => {
      let studentId = file.fieldname;
      if (studentId.startsWith('photo_')) {
        studentId = studentId.replace('photo_', '');
      }
      
      const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      
      if (studentId && studentId.length === 24) { // Basic check for mongoose ID
        bulkOps.push({
          updateOne: {
            filter: { _id: studentId },
            update: { $set: { 'personalDetails.studentPhoto': photoUrl } }
          }
        });
      }
    });

    if (bulkOps.length > 0) {
      const result = await Student.bulkWrite(bulkOps);
      res.json({ message: 'Photos updated successfully', result });
    } else {
      res.status(400).json({ message: 'No valid student IDs found in file fields. Ensure field names match student IDs.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update student clubs
// @route   PUT /api/students/bulk/clubs
// @access  Private (Admin)
const bulkUpdateClubs = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting [{ studentId: '...', club: '...' }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of updates in "updates" field.' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.studentId },
        update: { $set: { 'personalDetails.clubs': update.club } }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Student.bulkWrite(bulkOps);
      res.json({ message: 'Clubs updated successfully', result });
    } else {
      res.json({ message: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getFavoriteStudents,
  toggleStudentFavorite,
  bulkUpdateRollNumbers,
  bulkUpdateHouseNames,
  bulkUpdatePhotos,
  bulkUpdateClubs
};
