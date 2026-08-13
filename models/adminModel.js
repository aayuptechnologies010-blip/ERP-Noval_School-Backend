const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 4,
    select: false // Exclude password from query results by default
  },
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  address: {
    type: String,
    default: ''
  },
  qualification: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  joiningDate: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
