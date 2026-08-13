const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt|csv/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Invalid file type! Allowed types are images, pdf, doc, xls, txt, csv.'));
  }
}

// Init single upload
const uploadSingle = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Init multiple upload for specific fields
const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'fatherPhoto', maxCount: 1 },
  { name: 'motherPhoto', maxCount: 1 },
  { name: 'familyPhoto', maxCount: 1 }
]);

// Init any upload for bulk operations (like bulk photo update)
const uploadAny = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).any();

const uploadDocument = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = { uploadSingle, uploadMultiple, uploadAny, uploadDocument };
