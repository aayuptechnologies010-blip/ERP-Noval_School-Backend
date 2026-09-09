const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('./models/roleModel');
const Staff = require('./models/staffModel');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Create/get roles
    let role1 = await Role.findOne({ roleName: "PRIMARY TEACHERS" });
    if (!role1) {
      role1 = await Role.create({ roleName: "PRIMARY TEACHERS", description: "Primary Teachers" });
    }

    let role2 = await Role.findOne({ roleName: "NON TEACHING" });
    if (!role2) {
      role2 = await Role.create({ roleName: "NON TEACHING", description: "Support Staff" });
    }

    // Create staff
    const staffData = [
      {
        firstName: "Ramesh",
        lastName: "Kumar",
        userName: "EMP001",
        password: "password123",
        role: role1._id,
        designation: "Math Teacher",
        qualification: "Teaching",
        emailId: "ramesh@example.com",
        contactNo: "9876543210"
      },
      {
        firstName: "Suresh",
        lastName: "Singh",
        userName: "EMP002",
        password: "password123",
        role: role2._id,
        designation: "Accountant",
        qualification: "OFFICE STAFF",
        emailId: "suresh@example.com",
        contactNo: "9876543211"
      },
      {
        firstName: "Sunita",
        lastName: "Devi",
        userName: "EMP003",
        password: "password123",
        role: role1._id,
        designation: "Science Teacher",
        qualification: "Teaching",
        emailId: "sunita@example.com",
        contactNo: "9876543212"
      }
    ];

    for (let s of staffData) {
      if (!(await Staff.findOne({ userName: s.userName }))) {
        await Staff.create(s);
        console.log(`Created staff ${s.userName}`);
      }
    }

    console.log("Seeding done");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
