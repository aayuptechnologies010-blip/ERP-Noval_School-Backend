const mongoose = require('mongoose');

const userPermissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: [true, 'User is required'],
    unique: true // One permission profile per user
  },
  schools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolGlobalDetails'
  }]
}, {
  timestamps: true
});

const UserPermission = mongoose.model('UserPermission', userPermissionSchema);

module.exports = UserPermission;
