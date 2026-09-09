const mongoose = require('mongoose');

const prospectusEntrySchema = new mongoose.Schema({
  enquiryRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Enquiry' 
  },
  enquiryNo: { 
    type: String 
  },
  studentClass: { 
    type: String, // Kept String for simplicity if not strictly tied to SchoolClass ref in frontend
    required: [true, 'Class is required'] 
  },
  board: { type: String },
  prospectusNo: { 
    type: String, 
    required: [true, 'Reg No./ Pros No. is required'], 
    unique: true 
  },
  date: { 
    type: Date, 
    required: [true, 'Date is required'] 
  },
  session: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear' 
  },
  studentName: { 
    type: String, 
    required: [true, 'Student Name is required'] 
  },
  middleName: { type: String },
  lastName: { type: String },
  reference: { type: String },
  dob: { 
    type: Date, 
    required: [true, 'Date of Birth is required'] 
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'] 
  },
  
  fatherName: { 
    type: String, 
    required: [true, 'Father Name is required'] 
  },
  fatherMiddleName: { type: String },
  fatherLastName: { type: String },
  contactMobile: { 
    type: String, 
    required: [true, 'Contact Mobile is required'] 
  },
  
  motherName: { type: String },
  motherMiddleName: { type: String },
  motherLastName: { type: String },
  
  contactPerson: { type: String },
  contactEmail: { type: String },
  
  address: {
    village: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String }
  },
  
  remark: { type: String },
  
  admissionTestDate: { type: Date },
  admissionTestTime: { type: String },
  interactionDate: { type: Date },
  interactionTime: { type: String },
  
  stationaryItems: [{
    stationary: { type: mongoose.Schema.Types.ObjectId, ref: 'StationaryDetails' },
    amount: { type: Number }
  }],
  
  paymode: { type: String },
  isOnline: { type: Boolean, default: false },
  
  // Manual List Generation fields
  meritList: { type: String },
  selectedClass: { type: String },
  admStatus: { type: String, default: 'Pending' },
  meritListDate: { type: Date }
  
}, {
  timestamps: true
});

const ProspectusEntry = mongoose.model('ProspectusEntry', prospectusEntrySchema);

module.exports = ProspectusEntry;
