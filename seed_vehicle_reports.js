const mongoose = require('mongoose');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({}, { strict: false }));
  const VehicleFuel = mongoose.model('VehicleFuel', new mongoose.Schema({}, { strict: false }));
  const VehicleService = mongoose.model('VehicleService', new mongoose.Schema({}, { strict: false }));
  const DailyMeter = mongoose.model('DailyMeter', new mongoose.Schema({}, { strict: false }));

  const vehicles = await Vehicle.find().lean();
  console.log('Vehicles found:', vehicles.length);

  const fuelEntries = [];
  const serviceEntries = [];
  const meterEntries = [];

  const today = new Date();

  vehicles.forEach((v, idx) => {
    let currentMeter = 45000 + (idx * 2500);

    for (let d = 10; d >= 0; d--) {
      const entryDate = new Date(today);
      entryDate.setDate(entryDate.getDate() - d);
      entryDate.setHours(8, 30, 0, 0);

      const runKm = 45 + Math.floor(Math.random() * 25);
      const opening = currentMeter;
      const closing = opening + runKm;
      currentMeter = closing;

      meterEntries.push({
        vehicle: v._id,
        date: entryDate,
        openingMeter: opening,
        closingMeter: closing,
        totalKm: runKm,
        remarks: 'School morning & afternoon route run'
      });

      if (d % 2 === 0) {
        const litres = 12 + Math.floor(Math.random() * 8);
        const pricePerLitre = 92.5;
        fuelEntries.push({
          vehicle: v._id,
          date: entryDate,
          fuelType: 'Diesel',
          quantity: litres,
          pricePerLitre: pricePerLitre,
          totalCost: Math.round(litres * pricePerLitre),
          currentMeter: closing,
          remarks: 'Indian Oil Fuel Station'
        });
      }
    }

    const serviceTypes = ['Oil Change & Filter', 'Brake Inspection', 'Tyre Rotation', 'General Servicing', 'AC Maintenance'];
    for (let s = 1; s <= 2; s++) {
      const sDate = new Date(today);
      sDate.setDate(sDate.getDate() - (s * 35));
      const nextDate = new Date(sDate);
      nextDate.setDate(nextDate.getDate() + 90);

      serviceEntries.push({
        vehicle: v._id,
        serviceDate: sDate,
        nextServiceDate: nextDate,
        serviceType: serviceTypes[(idx + s) % serviceTypes.length],
        garageName: 'Naval School Central Workshop',
        cost: 2500 + (Math.floor(Math.random() * 6) * 500),
        currentMeter: currentMeter - (s * 1500),
        remarks: 'Periodic preventive maintenance'
      });
    }
  });

  await VehicleFuel.deleteMany({});
  await VehicleService.deleteMany({});
  await DailyMeter.deleteMany({});

  await VehicleFuel.insertMany(fuelEntries);
  await VehicleService.insertMany(serviceEntries);
  await DailyMeter.insertMany(meterEntries);

  console.log('Seeded Fuel Entries:', fuelEntries.length);
  console.log('Seeded Service Entries:', serviceEntries.length);
  console.log('Seeded Daily Meter Entries:', meterEntries.length);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
