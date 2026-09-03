const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Personal Details
  personalDetails: {
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    bloodGroup: { type: String },
    religion: { type: String },
    caste: { type: String },
    subCaste: { type: String },
    nationality: { type: String, default: 'Indian' },
    placeOfBirth: { type: String },
    motherTongue: { type: String },
    studentPhoto: { type: String, default: '' },
    parish: { type: String },
    schoolCategory: { type: String },
    houseNames: { type: String },
    isNachEcs: { type: Boolean, default: false },
    isEwsCwsn: { type: String },
    isMinority: { type: Boolean, default: false },
    isDisabilityCwsn: { type: Boolean, default: false },
    disabilityDescription: { type: String },
    isRte: { type: String },
    clubs: { type: String },
    cadetType: { type: String },
    statesNationalCompetitions: { type: String },
    foodStatus: { type: String },
    boardingHostel: { type: String, default: 'No' },
    isOnlyChild: { type: Boolean, default: false },
  },

  // Academic Details
  academicDetails: {
    admissionNumber: { type: String, required: true, unique: true },
    admissionStatus: { type: String, default: 'Continuous' },
    currentStatus: { type: String, default: 'STUDYING' },
    reason: { type: String },
    rollNumber: { type: String },
    class: { type: String },
    section: { type: String },
    board: { type: String },
    dateOfAdmission: { type: Date },
    dateOfJoining: { type: Date },
    stream: { type: String },
    optionalSubject: { type: String },
    previousClass: { type: String },
    sixSubject: { type: String }
  },

  // Transport Details
  transportDetails: {
    isTransportStudent: { type: Boolean, default: false },
    isSelfTransport: { type: Boolean, default: false },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleRoute' },
    stop: { type: mongoose.Schema.Types.ObjectId, ref: 'RouteStop' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    transportGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportGroup' },
    transportMedium: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportMedium' },
    transportFee: { type: Number, default: 0 },
    assignedDate: { type: Date, default: Date.now }
  },

  // Unique Ids
  uniqueIds: {
    udiseNumber: { type: String },
    pen: { type: String }, // Permanent Education Number
    apaarId: { type: String },
    ePunjabNumber: { type: String },
    feesNumber: { type: String },
    saralNumber: { type: String },
    srnNumber: { type: String }, // S.R.N./UMRN/SATS Number
    issen: { type: Boolean, default: false },
    abhaNumber: { type: String },
    billGrNumber: { type: String },
    studentNumber: { type: String },
    rfidCardNumber: { type: String }
  },

  // Address & Communication
  contactAddress: {
    contactNumber: { type: String },
    secondaryContactNo: { type: String },
    studentEmail: { type: String },
    currentAddress: { type: String },
    pinCode: { type: String },
    city: { type: String },
    state: { type: String },
    permanentAddress: { type: String },
    permanentPinCode: { type: String },
    permanentCity: { type: String },
    permanentState: { type: String },
    domicileState: { type: String }
  },

  // Family Details
  familyDetails: {
    familyId: { type: String },
    parentStatus: { type: String },
    staffName: { type: String },
    familyPhoto: { type: String, default: '' },
    father: {
      title: { type: String, default: 'Mr.' },
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      aadharNumber: { type: String },
      panNumber: { type: String },
      annualIncome: { type: String },
      dob: { type: Date },
      mobile: { type: String },
      phone: { type: String },
      email: { type: String },
      residenceAddress: { type: String },
      qualification: { type: String },
      profession: { type: String },
      professionDetails: { type: String },
      designation: { type: String },
      designationDetails: { type: String },
      companyName: { type: String },
      businessDetails: { type: String },
      serviceIn: { type: String },
      officeAddress: { type: String },
      officePhone: { type: String },
      officeMobile: { type: String },
      officeExtension: { type: String },
      officeEmail: { type: String },
      officeWebsite: { type: String },
      isAlumni: { type: String },
      batchYear: { type: String },
      photo: { type: String, default: '' }
    },
    mother: {
      title: { type: String, default: 'Mrs.' },
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      aadharNumber: { type: String },
      panNumber: { type: String },
      annualIncome: { type: String },
      dob: { type: Date },
      mobile: { type: String },
      phone: { type: String },
      email: { type: String },
      residenceAddress: { type: String },
      qualification: { type: String },
      profession: { type: String },
      professionDetails: { type: String },
      designation: { type: String },
      designationDetails: { type: String },
      companyName: { type: String },
      businessDetails: { type: String },
      serviceIn: { type: String },
      officeAddress: { type: String },
      officePhone: { type: String },
      officeMobile: { type: String },
      officeExtension: { type: String },
      officeEmail: { type: String },
      officeWebsite: { type: String },
      isAlumni: { type: String },
      batchYear: { type: String },
      anniversaryDate: { type: Date },
      photo: { type: String, default: '' }
    }
  },

  // Guardian Details
  guardianDetails: {
    title: { type: String, default: 'Mr.' },
    name: { type: String },
    dob: { type: Date },
    income: { type: String },
    relationship: { type: String },
    mobile: { type: String },
    phone: { type: String },
    email: { type: String },
    residenceAddress: { type: String },
    qualification: { type: String },
    profession: { type: String },
    professionDetails: { type: String },
    designation: { type: String },
    companyName: { type: String },
    businessDetails: { type: String },
    serviceIn: { type: String },
    officeAddress: { type: String },
    officePhone: { type: String },
    officeMobile: { type: String },
    officeExtension: { type: String },
    officeEmail: { type: String },
    officeWebsite: { type: String },
    secondaryGuardianName: { type: String },
    secondaryGuardianMobile: { type: String },
    secondaryGuardianRelationship: { type: String }
  },

  // Emergency Contacts
  emergencyContacts: [
    {
      name: { type: String },
      smsNumber: { type: String },
      email: { type: String },
      mobileNumber: { type: String },
      phoneNumber: { type: String },
      address: { type: String },
      relation: { type: String }
    }
  ],

  // Custom Status
  isFavorite: { type: Boolean, default: false },

  // Post-Admission Workflow
  isAdmissionVerified: { type: Boolean, default: false },
  uploadedDocuments: [
    {
      documentName: { type: String }, // e.g., Aadhar, TC, Birth Certificate
      documentUrl: { type: String },
      isVerified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }
  ]

}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
