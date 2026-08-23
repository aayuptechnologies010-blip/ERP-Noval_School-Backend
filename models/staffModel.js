const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, default: 'Mr.' }, // Mr., Mrs., Miss.
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  staffPhoto: { type: String, default: '' },
  
  // Professional Info
  userName: { type: String, required: true, unique: true }, // e.g., SF066
  password: { type: String, required: true, select: false },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  designation: { type: String },
  qualification: { type: String },
  
  // Dates
  dob: { type: Date },
  doj: { type: Date }, // Date of Joining
  dojEpf: { type: Date },
  dateOfAnniversary: { type: Date },
  
  // Contact & Address
  contactNo: { type: String },
  alternateMobile: { type: String },
  emergencyContactNo: { type: String },
  emailId: { type: String },
  alternateEmailId: { type: String },
  address: { type: String }, // Current Address
  permanentAddress: { type: String },
  
  // Statutory & IDs
  aadharCardNo: { type: String },
  panNumber: { type: String },
  uanNumber: { type: String },
  nationalTeacherId: { type: String },
  stateTeacherId: { type: String },
  cbseId: { type: String },
  
  // Personal Details
  gender: { type: String },
  maritalStatus: { type: String, default: 'Unmarried' },
  fatherSpouseName: { type: String },
  fatherSpouseContactNo: { type: String },
  religion: { type: String },
  nationality: { type: String, default: 'Indian' },
  
  // Status
  isActive: { type: Boolean, default: true },
  // Class Teacher Assignment
  assignedClass: { type: String, default: null },
  assignedSection: { type: String, default: null },
  
  // Custom Status
  isFavorite: { type: Boolean, default: false }
  
}, {
  timestamps: true
});

// Encrypt password before saving
staffSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
staffSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
