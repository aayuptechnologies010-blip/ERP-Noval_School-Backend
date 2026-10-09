const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Aayup Projects/ERP-Naval School/backend/ERP-Noval_School-Backend/.env' });
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://navalSchool:1234@erp-novalschool.xixvyba.mongodb.net/test?retryWrites=true&w=majority';

// Dohrighat is located in Mau district, UP.
// School Campus is at Dohrighat.
// Approximate real-world distance slabs and transport fees for school bus routes from Dohrighat campus:
// Tier 1: Local / Dohrighat proper (0 - 4 km) -> ₹600 - ₹700
// Tier 2: Nearby villages (5 - 8 km) -> ₹800 - ₹900
// Tier 3: Medium distance (9 - 14 km) -> ₹1000 - ₹1150
// Tier 4: Far destinations (15 - 22 km) -> ₹1250 - ₹1400
// Tier 5: Long-distance / Outskirts (23+ km) -> ₹1500 - ₹1600

const LOCATION_DATA = {
  // Local Dohrighat & Immediate vicinity (1-4 km)
  'DOHRIGHAT': { km: 3, fee: 650 },
  'DOHRIGHAT KASBA': { km: 4, fee: 700 },
  'HEAD CANAL': { km: 3, fee: 650 },
  'DAM MAHULA': { km: 4, fee: 700 },
  'MAHULA': { km: 5, fee: 750 },
  'MAHLU': { km: 5, fee: 750 },

  // Surrounding villages (5-8 km)
  'GONTHA': { km: 6, fee: 800 },
  'KUSUMHA': { km: 6, fee: 800 },
  'KUSHMHA': { km: 6, fee: 800 },
  'SIYARAHI': { km: 7, fee: 850 },
  'PANAIL': { km: 8, fee: 900 },
  'PANAIL2': { km: 8, fee: 900 },
  'SIDHUAPAR': { km: 6, fee: 800 },
  'CHUTI DAAR': { km: 7, fee: 850 },
  'DAARI': { km: 7, fee: 850 },
  'DHANAULI': { km: 8, fee: 900 },
  'PARSIYA': { km: 8, fee: 900 },
  'MATHIYA': { km: 7, fee: 850 },
  'KHETAPUR': { km: 8, fee: 900 },
  'SOHRABHAR': { km: 8, fee: 900 },

  // Medium distance (9-14 km)
  'NAI BAZAR': { km: 10, fee: 1000 },
  'NAIBAZAR': { km: 10, fee: 1000 },
  'CHOTKA FARSARAH': { km: 10, fee: 1000 },
  'BADKA FARSARA': { km: 11, fee: 1050 },
  'SIPHA GAON': { km: 11, fee: 1050 },
  'PATNAI BUJURG': { km: 12, fee: 1100 },
  'PATNA CHAURAHA': { km: 12, fee: 1100 },
  'GODAWLI': { km: 11, fee: 1050 },
  'BAHADURPUR': { km: 12, fee: 1100 },
  'IBRAHIMABAD': { km: 12, fee: 1100 },
  'TEKANPUR BAANDH': { km: 11, fee: 1050 },
  'HARDAULI': { km: 12, fee: 1100 },
  'LATGHAT': { km: 13, fee: 1150 },
  'JOKHARA': { km: 14, fee: 1200 },
  'KAKBHAR': { km: 13, fee: 1150 },
  'CHAUKO': { km: 13, fee: 1150 },
  'TARAUKA': { km: 14, fee: 1200 },
  'BHAGWAN CHAK': { km: 14, fee: 1200 },
  'BARDIHA': { km: 13, fee: 1150 },

  // Distant villages & major towns (15-22 km)
  'AMILA': { km: 15, fee: 1250 },
  'SARAYAN': { km: 16, fee: 1300 },
  'MARWATIA': { km: 15, fee: 1250 },
  'BADHALGANJ BYPASS': { km: 16, fee: 1300 },
  'BARHALGANJ': { km: 17, fee: 1350 },
  'BUDAWAR': { km: 17, fee: 1350 },
  'PURMOTI': { km: 16, fee: 1300 },
  'SAKKARPUR': { km: 18, fee: 1350 },
  'KORAULI': { km: 18, fee: 1350 },
  'BILAULI': { km: 19, fee: 1400 },
  'PAUS': { km: 19, fee: 1400 },
  'GAURIDIH': { km: 19, fee: 1400 },
  'SAIFAN': { km: 20, fee: 1450 },
  'RASOOLPUR': { km: 20, fee: 1450 },
  'SARAUWAH': { km: 20, fee: 1450 },
  'SARANUWAH': { km: 20, fee: 1450 },
  'CHAPIA': { km: 18, fee: 1350 },
  'CHAPIA II': { km: 18, fee: 1350 },
  'VISUNPURA': { km: 19, fee: 1400 },
  'THAKUR GAON': { km: 18, fee: 1350 },

  // Outlying / Regional routes (22+ km)
  'SURJAPUR': { km: 21, fee: 1450 },
  'SURAJPUR': { km: 21, fee: 1450 },
  'PALIYA': { km: 22, fee: 1500 },
  'JHUMILA': { km: 23, fee: 1500 },
  'MAHARAJGANJ II': { km: 24, fee: 1550 },
  'HAZIPUR II': { km: 23, fee: 1500 },
  'APDARIYA': { km: 22, fee: 1500 },
  'USARI KHURD': { km: 22, fee: 1500 },
  'USARI KURD': { km: 22, fee: 1500 },
  'REYANW': { km: 23, fee: 1500 },
  'PAVHARIYA': { km: 24, fee: 1550 },
  'SORAINA': { km: 24, fee: 1550 },
  'CHAURADEEH': { km: 25, fee: 1600 },
  'KADIPUR': { km: 21, fee: 1450 },
  'LAMI': { km: 22, fee: 1500 },
};

function getMetricsForStop(stopName, order) {
  // Strip prefix like "1-", "2-", etc.
  const cleanName = stopName.replace(/^\d+[-–\s]*/, '').trim().toUpperCase();
  
  if (LOCATION_DATA[cleanName]) {
    return LOCATION_DATA[cleanName];
  }
  
  // Check substring match
  for (const [key, val] of Object.entries(LOCATION_DATA)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return val;
    }
  }

  // Fallback based on order / route position
  const estKm = Math.min(30, Math.max(4, Math.round(4 + (order || 1) * 0.4)));
  const estFee = Math.min(1600, Math.max(650, 600 + Math.round((estKm - 3) * 45 / 50) * 50));
  return { km: estKm, fee: estFee };
}

async function updateTransportFees() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log('--- Step 1: Updating RouteStop collection fees & distances ---');
  const stops = await db.collection('routestops').find({}).toArray();
  
  const stopFeeMap = {};
  let updatedStopsCount = 0;

  for (const stop of stops) {
    const metrics = getMetricsForStop(stop.stopName, stop.stopOrder);
    stopFeeMap[stop._id.toString()] = metrics.fee;

    await db.collection('routestops').updateOne(
      { _id: stop._id },
      {
        $set: {
          fee: metrics.fee,
          distanceFromStart: metrics.km
        }
      }
    );
    updatedStopsCount++;
  }
  console.log(`Updated ${updatedStopsCount} stops with realistic distance & fees.`);

  console.log('\n--- Step 2: Updating Students with their assigned stop fees ---');
  const transportStudents = await db.collection('students').find({
    'transportDetails.isTransportStudent': true
  }).toArray();

  let updatedStudentsCount = 0;
  for (const st of transportStudents) {
    const stopId = st.transportDetails?.stop ? st.transportDetails.stop.toString() : null;
    let actualFee = 650; // default minimum

    if (stopId && stopFeeMap[stopId]) {
      actualFee = stopFeeMap[stopId];
    }

    await db.collection('students').updateOne(
      { _id: st._id },
      {
        $set: {
          'transportDetails.transportFee': actualFee,
          transportFee: actualFee
        }
      }
    );
    updatedStudentsCount++;
  }
  console.log(`Updated ${updatedStudentsCount} students with their specific stop fees.`);

  // Sample check
  const sampleStops = await db.collection('routestops').find({}).limit(10).toArray();
  console.log('\nSample Updated Stops:');
  sampleStops.forEach(s => console.log(`- ${s.stopName}: ₹${s.fee} (${s.distanceFromStart} km)`));

  const sampleStudents = await db.collection('students').find({
    'transportDetails.isTransportStudent': true
  }).limit(10).toArray();
  console.log('\nSample Updated Students:');
  for (const st of sampleStudents) {
    const sId = st.transportDetails?.stop;
    const stopDoc = stops.find(s => s._id.toString() === (sId ? sId.toString() : ''));
    console.log(`- Adm: ${st.academicDetails?.admissionNumber || st.admissionNumber} | Stop: ${stopDoc ? stopDoc.stopName : 'N/A'} | Fee: ₹${st.transportDetails?.transportFee}`);
  }

  process.exit(0);
}

updateTransportFees();
