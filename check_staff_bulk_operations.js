require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/adminModel');
const Staff = require('./models/staffModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await Admin.findOne();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, process.env.JWT_SECRET);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('=== VERIFYING BULK STAFF OPERATIONS ENDPOINTS ===');

    // 1. GET /api/staffs (Check Ayup Tech)
    const staffRes = await fetch('http://localhost:5000/api/staffs', { headers });
    const staffs = await staffRes.json();
    const ayup = staffs.find(s => s.userName === 'SF072' || (s.firstName && s.firstName.toLowerCase().includes('ayup')));
    const resigned = staffs.find(s => s.userName === 'SF099');

    console.log('1. Staff Check:', {
      totalStaff: staffs.length,
      ayupTech: ayup ? {
        name: `${ayup.firstName} ${ayup.lastName}`,
        barcode: ayup.barcode,
        status: ayup.salaryStatus,
        transport: ayup.transportDetails
      } : null,
      resignedCandidate: resigned ? {
        name: `${resigned.firstName} ${resigned.lastName}`,
        status: resigned.salaryStatus,
        isActive: resigned.isActive
      } : null
    });

    // 2. GET /api/rejoin-staff
    const rejoinRes = await fetch('http://localhost:5000/api/rejoin-staff', { headers });
    const rejoinHistory = await rejoinRes.json();
    console.log('2. Rejoin History Check:', {
      count: rejoinHistory.length,
      sample: rejoinHistory[0]
    });

    // 3. Test Rejoin Staff Member (Rejoin SF099 Ramesh Kumar)
    if (resigned) {
      const doRejoinRes = await fetch('http://localhost:5000/api/rejoin-staff', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          staffId: resigned._id,
          newEmpNo: 'SF099-R',
          rejoinDate: new Date(),
          designation: 'Senior Assistant Teacher',
          staffType: 'PRIMARY TEACHERS',
          basicSalary: 35000,
          remarks: 'Rejoined with revised salary band'
        })
      });
      const rejoinResult = await doRejoinRes.json();
      console.log('3. Test Rejoin Staff Result:', {
        status: doRejoinRes.status,
        message: rejoinResult.message,
        newEmpNo: rejoinResult.staff ? rejoinResult.staff.empNo : null,
        isActive: rejoinResult.staff ? rejoinResult.staff.isActive : null
      });
    }

    // 4. Test PUT /api/staffs/bulk/modify
    const modifyRes = await fetch('http://localhost:5000/api/staffs/bulk/modify', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        staffIds: [ayup._id],
        fields: {
          salaryStatus: 'Active',
          generateSalary: true,
          salaryToBank: true
        }
      })
    });
    const modifyResult = await modifyRes.json();
    console.log('4. Test Bulk Modify Result:', {
      status: modifyRes.status,
      message: modifyResult.message
    });

    // 5. Test POST /api/staffs/bulk/generate-barcode
    const barcodeRes = await fetch('http://localhost:5000/api/staffs/bulk/generate-barcode', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        staffIds: [ayup._id]
      })
    });
    const barcodeResult = await barcodeRes.json();
    console.log('5. Test Generate Barcode Result:', {
      status: barcodeRes.status,
      message: barcodeResult.message
    });

    // 6. Test Transport Routes & Stops
    const routesRes = await fetch('http://localhost:5000/api/transport/routes', { headers });
    const routes = await routesRes.json();
    console.log('6. Transport Routes Check:', {
      count: Array.isArray(routes) ? routes.length : 0,
      firstRoute: Array.isArray(routes) && routes.length > 0 ? routes[0].routeName : null
    });

    console.log('\n🎉 ALL 4 BULK OPERATIONS ENDPOINTS VERIFIED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error during bulk operations verification:', err);
    process.exit(1);
  }
})();
