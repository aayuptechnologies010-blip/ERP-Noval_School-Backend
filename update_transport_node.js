const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const records = JSON.parse(fs.readFileSync('transport_pdf_records.json', 'utf8'));
  console.log(`Loaded ${records.length} records from JSON.`);

  const db = mongoose.connection.db;

  // 1. Fetch all routes
  const existingRoutes = await db.collection('vehicleroutes').find({}).toArray();
  const routesMap = {};
  existingRoutes.forEach(r => {
    routesMap[r.routeName.trim().toUpperCase()] = r._id;
  });

  // 2. Fetch all stops
  const existingStops = await db.collection('routestops').find({}).toArray();
  const stopsMap = {};
  existingStops.forEach(s => {
    stopsMap[s.stopName.trim().toUpperCase()] = s;
  });

  // 3. Fetch all vehicles
  const existingVehicles = await db.collection('vehicles').find({}).toArray();
  const vehiclesMap = {};
  existingVehicles.forEach(v => {
    vehiclesMap[(v.vehicleNo || '').trim().toUpperCase()] = v._id;
  });

  console.log(`Current DB: Routes=${existingRoutes.length}, Stops=${existingStops.length}, Vehicles=${existingVehicles.length}`);

  // 4. Build Bulk Operations
  const bulkOps = [];
  let skipped = 0;

  for (const rec of records) {
    const adm = rec.admNo.trim();
    const stName = rec.stop.trim();
    const stKey = stName.toUpperCase();
    const stopDoc = stopsMap[stKey];

    let rName = 'Route 1';
    let vName = 'Bus No. 1';
    const m = stName.match(/^(\d+)-/);
    if (m) {
      rName = `Route ${m[1]}`;
      vName = `Bus No. ${m[1]}`;
    } else {
      rName = `Route - ${stName}`;
    }

    const rId = routesMap[rName.toUpperCase()] || (stopDoc ? stopDoc.route : null);
    const vId = vehiclesMap[vName.toUpperCase()] || null;
    const sId = stopDoc ? stopDoc._id : null;

    let assignDate = new Date();
    if (rec.assignDate) {
      const parsed = Date.parse(rec.assignDate);
      if (!isNaN(parsed)) assignDate = new Date(parsed);
    }

    bulkOps.push({
      updateOne: {
        filter: { 'academicDetails.admissionNumber': adm },
        update: {
          $set: {
            transportAssigned: true,
            transportFee: rec.fare,
            transportRoute: rName,
            transportStop: stName,
            vehicleNo: vName,
            'transportDetails.isTransportStudent': true,
            'transportDetails.isSelfTransport': false,
            'transportDetails.route': rId,
            'transportDetails.stop': sId,
            'transportDetails.vehicle': vId,
            'transportDetails.transportFee': rec.fare,
            'transportDetails.assignedDate': assignDate,
            'transportDetails.agencyName': rec.agency || '',
            'contactAddress.currentAddress': rec.address,
            'contactAddress.contactNumber': rec.contact
          }
        }
      }
    });
  }

  console.log(`Executing ${bulkOps.length} updates in bulk...`);
  const result = await db.collection('students').bulkWrite(bulkOps, { ordered: false });
  console.log(`Bulk write finished! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  const totalTransport = await db.collection('students').countDocuments({ 'transportDetails.isTransportStudent': true });
  console.log(`Total students with transport in DB now: ${totalTransport}`);

  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
