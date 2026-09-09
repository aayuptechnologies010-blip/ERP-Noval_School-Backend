require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('./models/staffModel');
const RejoinStaff = require('./models/rejoinStaffModel');
const VehicleRoute = require('./models/vehicleRouteModel');
const RouteStop = require('./models/routeStopModel');
const Vehicle = require('./models/vehicleModel');
const VehicleType = require('./models/vehicleTypeModel');

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed Transport Vehicle Types & Vehicles
    let busType = await VehicleType.findOne({ typeName: 'School Bus' });
    if (!busType) {
      busType = await VehicleType.create({ typeName: 'School Bus', description: 'Standard 45 seater bus' });
    }
    let vanType = await VehicleType.findOne({ typeName: 'Staff Van' });
    if (!vanType) {
      vanType = await VehicleType.create({ typeName: 'Staff Van', description: 'Staff commuter van' });
    }

    const vehicles = [
      { vehicleNo: 'UP-53-BT-1001', vehicleType: busType._id, capacity: 45, status: 'Active', remarks: 'Main route bus' },
      { vehicleNo: 'UP-53-BT-1002', vehicleType: busType._id, capacity: 35, status: 'Active', remarks: 'Secondary route bus' },
      { vehicleNo: 'UP-53-BT-1003', vehicleType: vanType._id, capacity: 14, status: 'Active', remarks: 'Staff dedicated van' }
    ];
    for (const v of vehicles) {
      await Vehicle.findOneAndUpdate({ vehicleNo: v.vehicleNo }, v, { upsert: true, new: true });
    }
    console.log('✅ Seeded Transport Vehicles');

    // 2. Seed Transport Routes & Stops
    const r1 = await VehicleRoute.findOneAndUpdate(
      { routeName: 'Route 1: City Center to School' },
      { routeName: 'Route 1: City Center to School', startPoint: 'City Center', endPoint: 'School Campus', remarks: 'North Corridor' },
      { upsert: true, new: true }
    );
    const r2 = await VehicleRoute.findOneAndUpdate(
      { routeName: 'Route 2: Cantt - Civil Lines' },
      { routeName: 'Route 2: Cantt - Civil Lines', startPoint: 'Cantt Railway Station', endPoint: 'School Campus', remarks: 'Central Corridor' },
      { upsert: true, new: true }
    );

    const stops = [
      { stopName: 'City Bus Stand', route: r1._id, stopOrder: 1, distanceFromStart: 2, fee: 1200 },
      { stopName: 'Civil Lines Gate 1', route: r1._id, stopOrder: 2, distanceFromStart: 5, fee: 1500 },
      { stopName: 'University Crossing', route: r1._id, stopOrder: 3, distanceFromStart: 8, fee: 1800 },
      { stopName: 'Cantt Station', route: r2._id, stopOrder: 1, distanceFromStart: 3, fee: 1400 },
      { stopName: 'Rail Vihar', route: r2._id, stopOrder: 2, distanceFromStart: 6, fee: 1600 }
    ];
    for (const s of stops) {
      await RouteStop.findOneAndUpdate({ stopName: s.stopName, route: s.route }, s, { upsert: true, new: true });
    }
    console.log('✅ Seeded Transport Routes and Stops');

    // 3. Seed / Update Staff: Ayup Tech (SF072)
    let ayup = await Staff.findOne({
      $or: [{ userName: 'SF072' }, { firstName: /ayup/i }]
    });

    if (ayup) {
      ayup.firstName = 'Ayup';
      ayup.lastName = 'Tech';
      ayup.barcode = 'STF-072-AYUP';
      ayup.salaryStatus = 'Active';
      ayup.isActive = true;
      ayup.generateSalary = true;
      ayup.salaryToBank = true;
      ayup.transportDetails = {
        isTransport: true,
        route: 'Route 1: City Center to School',
        stop: 'Civil Lines Gate 1',
        vehicle: 'UP-53-BT-1001',
        monthlyFee: 1500,
        assignedDate: new Date('2026-08-01')
      };
      await ayup.save();
      console.log('✅ Updated Ayup Tech with Barcode "STF-072-AYUP" and Transport Details');
    }

    // 4. Seed other staff with barcodes and transport details if empty
    const otherStaff = await Staff.find({ _id: { $ne: ayup ? ayup._id : null } });
    for (const s of otherStaff) {
      const code = s.userName || s.empNo || s.prefNo || s._id.toString().slice(-4);
      if (!s.barcode) {
        s.barcode = `STF-${code.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
      }
      if (!s.salaryStatus) {
        s.salaryStatus = 'Active';
      }
      await s.save();
    }
    console.log(`✅ Ensured barcodes for ${otherStaff.length} other staff members`);

    // 5. Seed Resigned Staff Member (to test Rejoin Staff feature)
    let resignedStaff = await Staff.findOne({ userName: 'SF099' });
    if (!resignedStaff) {
      resignedStaff = await Staff.create({
        prefNo: '99',
        title: 'Mr.',
        firstName: 'Ramesh',
        lastName: 'Kumar',
        userName: 'SF099',
        empNo: 'SF099',
        password: 'password123',
        designation: 'Assistant Teacher',
        department: 'PRIMARY TEACHERS',
        staffType: 'PRIMARY TEACHERS',
        salaryStatus: 'Resigned',
        isActive: false,
        leavingDate: new Date('2026-05-31'),
        reasonOfLeaving: 'Family relocation / Personal',
        basicSalary: 32000,
        bankName: 'State Bank of India',
        bankAccNo: '12345678901',
        contactNo: '9876500099',
        barcode: 'STF-099'
      });
      console.log('✅ Created Resigned Staff "Ramesh Kumar" (SF099) for testing Rejoin Staff');
    }

    // 6. Seed Past Rejoin History
    const pastRejoin = await RejoinStaff.findOne({ oldEmpNo: 'SF055' });
    if (!pastRejoin) {
      let staff55 = await Staff.findOne();
      await RejoinStaff.create({
        staffId: staff55 ? staff55._id : resignedStaff._id,
        staffName: 'Sunita Sharma',
        oldEmpNo: 'SF055',
        newEmpNo: 'SF055',
        rejoinDate: new Date('2026-07-01'),
        designation: 'Accountant',
        staffType: 'Support Staff',
        basicSalary: 28000,
        remarks: 'Rejoined post approved leave period',
        status: 'Rejoined'
      });
      console.log('✅ Seeded past Rejoin History record');
    }

    console.log('\n🎉 ALL BULK STAFF OPERATIONS DATA SEEDED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding bulk operations:', err);
    process.exit(1);
  }
})();
