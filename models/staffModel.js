const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  // Basic Info
  prefNo: { type: String, default: '' },
  title: { type: String, default: 'Mr.' }, // Mr., Mrs., Miss.
  firstName: { type: String, required: true },
  middleName: { type: String, default: '' },
  lastName: { type: String, required: true },
  staffPhoto: { type: String, default: '' },
  
  // Professional Info
  userName: { type: String, required: true, unique: true }, // e.g., SF066 / Emp Code
  password: { type: String, default: 'password123', select: false },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: false 
  },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  qualification: { type: String, default: '' },
  staffType: { type: String, default: '' },
  salaryAccount: { type: String, default: '' },
  
  // Dates
  dob: { type: Date },
  doj: { type: Date }, // Date of Joining
  dateOfRetire: { type: Date },
  isRetireExtended: { type: Boolean, default: false },
  dojEpf: { type: Date },
  dateOfAnniversary: { type: Date },
  
  // Contact & Address
  contactNo: { type: String, default: '' },
  phone: { type: String, default: '' },
  alternateMobile: { type: String, default: '' },
  emergencyContactNo: { type: String, default: '' },
  emergencyContactPerson: { type: String, default: '' },
  emailId: { type: String, default: '' },
  alternateEmailId: { type: String, default: '' },
  address: { type: String, default: '' }, // Current Address
  nativeAddress: { type: String, default: '' },
  permanentAddress: { type: String, default: '' },
  
  // Statutory & IDs
  aadharCardNo: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  uanNumber: { type: String, default: '' },
  nationalTeacherId: { type: String, default: '' },
  stateTeacherId: { type: String, default: '' },
  cbseId: { type: String, default: '' },
  cbsePassword: { type: String, default: '' },
  deviceNumber: { type: String, default: '' },
  familyId: { type: String, default: '' },
  remarks: { type: String, default: '' },
  nomineeGratuity: { type: String, default: '' },
  nomineePF: { type: String, default: '' },
  gratuityNomineeAadhar: { type: String, default: '' },
  gratuityNomineePhone: { type: String, default: '' },
  subjectExpertise: { type: String, default: '' },
  
  // Verification Checks
  childProtection: { type: Boolean, default: false },
  policeClearanceCert: { type: Boolean, default: false },
  medicalFitnessCert: { type: Boolean, default: false },
  specialEducator: { type: Boolean, default: false },
  autoAssignLeaves: { type: Boolean, default: false },
  
  // Personal Details
  gender: { type: String, default: 'Male' },
  bloodGroup: { type: String, default: '' },
  category: { type: String, default: '' },
  maritalStatus: { type: String, default: 'Unmarried' },
  spouseName: { type: String, default: '' },
  fatherSpouseName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  fatherSpouseContactNo: { type: String, default: '' },
  fatherSpouseRelation: { type: String, default: '' },
  religion: { type: String, default: '' },
  nationality: { type: String, default: 'Indian' },
  
  // Salary Details Tab
  empNo: { type: String, default: '' },
  pfNo: { type: String, default: '' },
  esiNo: { type: String, default: '' },
  bankName: { type: String, default: '' },
  bankAccNo: { type: String, default: '' },
  empAccNo: { type: String, default: '' },
  generateSalary: { type: Boolean, default: true },
  salaryToBank: { type: Boolean, default: true },
  salaryStatus: { type: String, default: 'Active' },
  machineNo: { type: String, default: '' },
  salaryGroup: { type: String, default: '' },
  taxRegime: { type: String, default: 'Tax payable in Existing Regime' },
  itSlabGroup: { type: String, default: 'For Male' },
  gratuityCode: { type: String, default: '' },
  ifscCode: { type: String, default: '' },
  paymentModes: { type: String, default: 'Bank Transfer' },
  rciNo: { type: String, default: '' },
  basicSalary: { type: Number, default: 0 },
  gradePay: { type: Number, default: 0 },
  payScale: { type: String, default: '' },
  payScaleAmount: { type: Number, default: 0 },
  
  // Barcode & Transport
  barcode: { type: String, default: '' },
  transportDetails: {
    isTransport: { type: Boolean, default: false },
    route: { type: String, default: '' },
    stop: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    monthlyFee: { type: Number, default: 0 },
    assignedDate: { type: Date }
  },
  rejoinDate: { type: Date },
  
  // Dates in Salary
  confirmationDate: { type: Date },
  permanentDate: { type: Date },
  leavingDate: { type: Date },
  probationDate: { type: Date },
  leavingDateEpf: { type: Date },
  leavingDateEps: { type: Date },
  incrementDate: { type: Date },
  reasonOfLeaving: { type: String, default: '' },
  shortName: { type: String, default: '' },
  macp1: { type: String, default: '' },
  macp2: { type: String, default: '' },
  macp3: { type: String, default: '' },
  pfJoiningDate: { type: Date },
  extensionStartDate: { type: Date },
  
  // Salary Heads Tab
  salaryHeads: { type: Array, default: [] },
  
  // Education Details Tab
  educationDetails: { type: Array, default: [] },
  
  // Experience Details Tab
  experienceDetails: { type: Array, default: [] },
  isTetQualified: { type: Boolean, default: false },
  isCtetQualified: { type: Boolean, default: false },
  tetExamLevel: { type: String, default: '' },
  
  // Other Info Tab
  childrenDetails: { type: Array, default: [] },
  extraActivities: { type: String, default: '' },
  reference1: {
    personName: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  reference2: {
    personName: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  otherInformation: { type: String, default: '' },

  // Status
  isActive: { type: Boolean, default: true },
  assignedClass: { type: String, default: null },
  assignedSection: { type: String, default: null },
  isFavorite: { type: Boolean, default: false },
  favoritePages: [{ type: String }],
  
  // Uploaded Staff Documents
  documents: [{
    documentType: { type: String, required: true },
    documentName: { type: String, required: true },
    documentUrl: { type: String, required: true },
    fileName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },
    uploadDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: String, default: '' },
    remarks: { type: String, default: '' }
  }]
}, {
  timestamps: true,
  strict: false
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
