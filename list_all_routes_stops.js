const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Aayup Projects/ERP-Naval School/backend/ERP-Noval_School-Backend/.env' });
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://navalSchool:1234@erp-novalschool.xixvyba.mongodb.net/test?retryWrites=true&w=majority';

async function check() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const routes = await db.collection('vehicleroutes').find({}).toArray();
  const routeMap = {};
  routes.forEach(r => routeMap[r._id.toString()] = r.routeName);

  const stops = await db.collection('routestops').find({}).sort({ route: 1, stopOrder: 1 }).toArray();
  console.log('Total stops:', stops.length);
  
  const byRoute = {};
  stops.forEach(s => {
    const rKey = s.route ? s.route.toString() : 'NONE';
    const rName = routeMap[rKey] || 'Unknown Route (' + rKey + ')';
    if (!byRoute[rName]) byRoute[rName] = [];
    byRoute[rName].push(s);
  });

  for (const [rName, rStops] of Object.entries(byRoute)) {
    console.log(`\n=== Route: ${rName} (${rStops.length} stops) ===`);
    rStops.forEach(s => {
      console.log(`   Stop: "${s.stopName}" (ID: ${s._id}) | Order: ${s.stopOrder} | Distance: ${s.distanceFromStart} km | Fee: ${s.fee}`);
    });
  }

  process.exit(0);
}
check();
