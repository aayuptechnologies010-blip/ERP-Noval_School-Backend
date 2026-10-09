const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Aayup Projects/ERP-Naval School/backend/ERP-Noval_School-Backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://navalSchool:1234@erp-novalschool.xixvyba.mongodb.net/test?retryWrites=true&w=majority';

async function check() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const routes = await db.collection('vehicleroutes').find({}).toArray();
  console.log('Total routes:', routes.length);
  const routeMap = {};
  routes.forEach(r => { routeMap[r._id.toString()] = r.routeName; });

  const stops = await db.collection('routestops').find({}).toArray();
  console.log('Total stops count:', stops.length);
  
  const sample = stops.map(s => ({
    id: s._id.toString(),
    routeId: s.route ? s.route.toString() : null,
    routeName: s.route ? routeMap[s.route.toString()] : 'No route',
    stopName: s.stopName,
    stopOrder: s.stopOrder,
    distanceFromStart: s.distanceFromStart,
    fee: s.fee
  }));

  console.log('Stops summary (first 35):');
  console.log(JSON.stringify(sample.slice(0, 35), null, 2));

  // Let's check routes and how many stops each route has
  const stopsByRoute = {};
  stops.forEach(s => {
    const rName = s.route ? (routeMap[s.route.toString()] || s.route.toString()) : 'Unassigned';
    if (!stopsByRoute[rName]) stopsByRoute[rName] = [];
    stopsByRoute[rName].push(s.stopName);
  });
  console.log('\nStops per route:');
  Object.keys(stopsByRoute).forEach(rn => {
    console.log(`${rn}: ${stopsByRoute[rn].length} stops -> ${stopsByRoute[rn].join(', ')}`);
  });

  const studentsWithTransport = await db.collection('students').countDocuments({ 'transportDetails.isTransportStudent': true });
  console.log('\nTotal students with transport:', studentsWithTransport);

  process.exit(0);
}
check();
