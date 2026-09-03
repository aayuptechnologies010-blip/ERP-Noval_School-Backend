const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllAgencies, createAgency, updateAgency, deleteAgency,
  getAllGroups, createGroup, updateGroup, deleteGroup,
  getAllMediums, createMedium, updateMedium, deleteMedium,
  getAllVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType,
  getAllVehicles, createVehicle, updateVehicle, deleteVehicle,
  getAllDrivers, createDriver, updateDriver, deleteDriver,
  getAllRoutes, createRoute, updateRoute, deleteRoute,
  getStopsByRoute, createStop, updateStop, deleteStop,
  getAllRouteRelations, createRouteRelation, updateRouteRelation, deleteRouteRelation,
  getFuelByVehicle, createFuelEntry, deleteFuelEntry,
  getServiceByVehicle, createServiceEntry, deleteServiceEntry,
  getMeterByVehicle, createMeterEntry, deleteMeterEntry,
  getAllReminders, createReminder, updateReminder, deleteReminder,
  assignTransportToStudent, assignSelfTransportBulk, transferStudentsRoute, removeTransportFromStudent, getStudentsByRoute,
} = require('../controllers/transportController');

// Travel Agency
router.get('/agencies', protect, getAllAgencies);
router.post('/agencies', protect, createAgency);
router.put('/agencies/:id', protect, updateAgency);
router.delete('/agencies/:id', protect, deleteAgency);

// Transport Group
router.get('/groups', protect, getAllGroups);
router.post('/groups', protect, createGroup);
router.put('/groups/:id', protect, updateGroup);
router.delete('/groups/:id', protect, deleteGroup);

// Transport Medium
router.get('/mediums', protect, getAllMediums);
router.post('/mediums', protect, createMedium);
router.put('/mediums/:id', protect, updateMedium);
router.delete('/mediums/:id', protect, deleteMedium);

// Vehicle Types
router.get('/vehicle-types', protect, getAllVehicleTypes);
router.post('/vehicle-types', protect, createVehicleType);
router.put('/vehicle-types/:id', protect, updateVehicleType);
router.delete('/vehicle-types/:id', protect, deleteVehicleType);

// Vehicles
router.get('/vehicles', protect, getAllVehicles);
router.post('/vehicles', protect, createVehicle);
router.put('/vehicles/:id', protect, updateVehicle);
router.delete('/vehicles/:id', protect, deleteVehicle);

// Drivers
router.get('/drivers', protect, getAllDrivers);
router.post('/drivers', protect, createDriver);
router.put('/drivers/:id', protect, updateDriver);
router.delete('/drivers/:id', protect, deleteDriver);

// Vehicle Routes
router.get('/routes', protect, getAllRoutes);
router.post('/routes', protect, createRoute);
router.put('/routes/:id', protect, updateRoute);
router.delete('/routes/:id', protect, deleteRoute);

// Route Stops
router.get('/stops/:routeId', protect, getStopsByRoute);
router.post('/stops', protect, createStop);
router.put('/stops/:id', protect, updateStop);
router.delete('/stops/:id', protect, deleteStop);

// Route Relations (Vehicle <-> Route Mapping)
router.get('/route-relations', protect, getAllRouteRelations);
router.post('/route-relations', protect, createRouteRelation);
router.put('/route-relations/:id', protect, updateRouteRelation);
router.delete('/route-relations/:id', protect, deleteRouteRelation);

// Fuel Entries
router.get('/fuel/:vehicleId', protect, getFuelByVehicle);
router.post('/fuel', protect, createFuelEntry);
router.delete('/fuel/:id', protect, deleteFuelEntry);

// Service Entries
router.get('/service/:vehicleId', protect, getServiceByVehicle);
router.post('/service', protect, createServiceEntry);
router.delete('/service/:id', protect, deleteServiceEntry);

// Daily Meter
router.get('/meter/:vehicleId', protect, getMeterByVehicle);
router.post('/meter', protect, createMeterEntry);
router.delete('/meter/:id', protect, deleteMeterEntry);

// Vehicle Reminders
router.get('/reminders', protect, getAllReminders);
router.post('/reminders', protect, createReminder);
router.put('/reminders/:id', protect, updateReminder);
router.delete('/reminders/:id', protect, deleteReminder);

// Student Transport Assignment
router.post('/assign-student', protect, assignTransportToStudent);
router.post('/assign-self-bulk', protect, assignSelfTransportBulk);
router.post('/transfer-route', protect, transferStudentsRoute);
router.delete('/assign-student/:studentId', protect, removeTransportFromStudent);
router.get('/students-by-route/:routeId', protect, getStudentsByRoute);




router.post('/attendance/mark', markAttendance);
router.get('/attendance/view', getAttendance);
router.get('/students', getTransportStudents);
router.post('/outpass', createOutPass);
router.get('/outpass', getOutPasses);



module.exports = router;
