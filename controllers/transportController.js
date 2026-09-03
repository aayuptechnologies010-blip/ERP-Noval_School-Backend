const TravelAgency = require('../models/travelAgencyModel');
const TransportGroup = require('../models/transportGroupModel');
const TransportMedium = require('../models/transportMediumModel');
const VehicleType = require('../models/vehicleTypeModel');
const Vehicle = require('../models/vehicleModel');
const Driver = require('../models/driverModel');
const VehicleRoute = require('../models/vehicleRouteModel');
const RouteStop = require('../models/routeStopModel');
const VehicleRouteRelation = require('../models/vehicleRouteRelationModel');
const VehicleFuel = require('../models/vehicleFuelModel');
const VehicleService = require('../models/vehicleServiceModel');
const DailyMeter = require('../models/dailyMeterModel');
const VehicleReminder = require('../models/vehicleReminderModel');
const Student = require('../models/studentModel');

// ========================
// TRAVEL AGENCY
// ========================
const getAllAgencies = async (req, res) => {
  try {
    const agencies = await TravelAgency.find().sort({ createdAt: -1 });
    res.status(200).json(agencies);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createAgency = async (req, res) => {
  try {
    const agency = await TravelAgency.create(req.body);
    res.status(201).json({ message: 'Agency created successfully', data: agency });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateAgency = async (req, res) => {
  try {
    const agency = await TravelAgency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.status(200).json({ message: 'Agency updated', data: agency });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteAgency = async (req, res) => {
  try {
    await TravelAgency.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Agency deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// TRANSPORT GROUP
// ========================
const getAllGroups = async (req, res) => {
  try {
    const groups = await TransportGroup.find().sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createGroup = async (req, res) => {
  try {
    const group = await TransportGroup.create(req.body);
    res.status(201).json({ message: 'Group created successfully', data: group });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateGroup = async (req, res) => {
  try {
    const group = await TransportGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json({ message: 'Group updated', data: group });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteGroup = async (req, res) => {
  try {
    await TransportGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Group deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// TRANSPORT MEDIUM
// ========================
const getAllMediums = async (req, res) => {
  try {
    const mediums = await TransportMedium.find().sort({ createdAt: -1 });
    res.status(200).json(mediums);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createMedium = async (req, res) => {
  try {
    const medium = await TransportMedium.create(req.body);
    res.status(201).json({ message: 'Medium created successfully', data: medium });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateMedium = async (req, res) => {
  try {
    const medium = await TransportMedium.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medium) return res.status(404).json({ message: 'Medium not found' });
    res.status(200).json({ message: 'Medium updated', data: medium });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteMedium = async (req, res) => {
  try {
    await TransportMedium.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Medium deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE TYPE
// ========================
const getAllVehicleTypes = async (req, res) => {
  try {
    const types = await VehicleType.find().sort({ createdAt: -1 });
    res.status(200).json(types);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createVehicleType = async (req, res) => {
  try {
    const type = await VehicleType.create(req.body);
    res.status(201).json({ message: 'Vehicle type created', data: type });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateVehicleType = async (req, res) => {
  try {
    const type = await VehicleType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) return res.status(404).json({ message: 'Vehicle type not found' });
    res.status(200).json({ message: 'Vehicle type updated', data: type });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteVehicleType = async (req, res) => {
  try {
    await VehicleType.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vehicle type deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE
// ========================
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('vehicleType', 'typeName')
      .populate('travelAgency', 'agencyName')
      .sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ message: 'Vehicle created successfully', data: vehicle });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle updated', data: vehicle });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// DRIVER
// ========================
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('vehicleAssigned', 'vehicleNo')
      .sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ message: 'Driver created successfully', data: driver });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json({ message: 'Driver updated', data: driver });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Driver deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE ROUTES
// ========================
const getAllRoutes = async (req, res) => {
  try {
    const routes = await VehicleRoute.find().sort({ createdAt: -1 });
    res.status(200).json(routes);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createRoute = async (req, res) => {
  try {
    const route = await VehicleRoute.create(req.body);
    res.status(201).json({ message: 'Route created', data: route });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateRoute = async (req, res) => {
  try {
    const route = await VehicleRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route updated', data: route });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteRoute = async (req, res) => {
  try {
    await VehicleRoute.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Route deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// ROUTE STOPS
// ========================
const getStopsByRoute = async (req, res) => {
  try {
    const stops = await RouteStop.find({ route: req.params.routeId })
      .populate('route', 'routeName')
      .sort({ stopOrder: 1 });
    res.status(200).json(stops);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createStop = async (req, res) => {
  try {
    const stop = await RouteStop.create(req.body);
    res.status(201).json({ message: 'Stop created', data: stop });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateStop = async (req, res) => {
  try {
    const stop = await RouteStop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    res.status(200).json({ message: 'Stop updated', data: stop });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteStop = async (req, res) => {
  try {
    await RouteStop.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Stop deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE ROUTE RELATIONS
// ========================
const getAllRouteRelations = async (req, res) => {
  try {
    const relations = await VehicleRouteRelation.find()
      .populate('route', 'routeName')
      .populate('vehicle', 'vehicleNo')
      .populate('driver', 'driverName')
      .sort({ createdAt: -1 });
    res.status(200).json(relations);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createRouteRelation = async (req, res) => {
  try {
    const relation = await VehicleRouteRelation.create(req.body);
    res.status(201).json({ message: 'Route Relation created', data: relation });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateRouteRelation = async (req, res) => {
  try {
    const relation = await VehicleRouteRelation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!relation) return res.status(404).json({ message: 'Relation not found' });
    res.status(200).json({ message: 'Relation updated', data: relation });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteRouteRelation = async (req, res) => {
  try {
    await VehicleRouteRelation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Relation deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE FUEL ENTRY
// ========================
const getFuelByVehicle = async (req, res) => {
  try {
    const entries = await VehicleFuel.find({ vehicle: req.params.vehicleId }).populate('vehicle', 'vehicleNo').sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createFuelEntry = async (req, res) => {
  try {
    const entry = await VehicleFuel.create(req.body);
    res.status(201).json({ message: 'Fuel entry added', data: entry });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteFuelEntry = async (req, res) => {
  try {
    await VehicleFuel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Fuel entry deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE SERVICE ENTRY
// ========================
const getServiceByVehicle = async (req, res) => {
  try {
    const entries = await VehicleService.find({ vehicle: req.params.vehicleId }).populate('vehicle', 'vehicleNo').sort({ serviceDate: -1 });
    res.status(200).json(entries);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createServiceEntry = async (req, res) => {
  try {
    const entry = await VehicleService.create(req.body);
    res.status(201).json({ message: 'Service entry added', data: entry });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteServiceEntry = async (req, res) => {
  try {
    await VehicleService.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service entry deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// DAILY METER ENTRY
// ========================
const getMeterByVehicle = async (req, res) => {
  try {
    const entries = await DailyMeter.find({ vehicle: req.params.vehicleId }).populate('vehicle', 'vehicleNo').sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createMeterEntry = async (req, res) => {
  try {
    const entry = new DailyMeter({ ...req.body, totalKm: req.body.closingMeter - req.body.openingMeter });
    await entry.save();
    res.status(201).json({ message: 'Meter entry added', data: entry });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteMeterEntry = async (req, res) => {
  try {
    await DailyMeter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Meter entry deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// VEHICLE REMINDER
// ========================
const getAllReminders = async (req, res) => {
  try {
    const reminders = await VehicleReminder.find().populate('vehicle', 'vehicleNo').sort({ dueDate: 1 });
    res.status(200).json(reminders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createReminder = async (req, res) => {
  try {
    const reminder = await VehicleReminder.create(req.body);
    res.status(201).json({ message: 'Reminder set', data: reminder });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateReminder = async (req, res) => {
  try {
    const reminder = await VehicleReminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.status(200).json({ message: 'Reminder updated', data: reminder });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteReminder = async (req, res) => {
  try {
    await VehicleReminder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ========================
// ASSIGN TRANSPORT TO STUDENT
// ========================
const assignTransportToStudent = async (req, res) => {
  try {
    const { studentId, route, stop, vehicle, transportFee, transportGroup, transportMedium, isSelfTransport } = req.body;
    
    let updatePayload = { 
      'transportDetails.isTransportStudent': true,
      'transportDetails.isSelfTransport': isSelfTransport || false
    };

    if (isSelfTransport) {
      updatePayload['transportDetails.route'] = null;
      updatePayload['transportDetails.stop'] = null;
      updatePayload['transportDetails.vehicle'] = null;
    } else {
      updatePayload['transportDetails.route'] = route;
      updatePayload['transportDetails.stop'] = stop;
      updatePayload['transportDetails.vehicle'] = vehicle;
      updatePayload['transportDetails.transportGroup'] = transportGroup;
      updatePayload['transportDetails.transportMedium'] = transportMedium;
      updatePayload['transportDetails.transportFee'] = transportFee;
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updatePayload },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Transport assigned successfully', data: student });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const assignSelfTransportBulk = async (req, res) => {
  try {
    const { studentIds } = req.body;
    if (!studentIds || !studentIds.length) return res.status(400).json({ message: 'No students selected' });
    
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { 
        $set: { 
          'transportDetails.isTransportStudent': true,
          'transportDetails.isSelfTransport': true,
          'transportDetails.route': null,
          'transportDetails.stop': null,
          'transportDetails.vehicle': null 
        } 
      }
    );
    res.status(200).json({ message: 'Self Transport assigned to selected students.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const transferStudentsRoute = async (req, res) => {
  try {
    const { studentIds, newRoute, newStop } = req.body;
    if (!studentIds || !studentIds.length) return res.status(400).json({ message: 'No students selected' });
    
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { 
        $set: { 
          'transportDetails.route': newRoute,
          'transportDetails.stop': newStop
        } 
      }
    );
    res.status(200).json({ message: 'Students transferred to new route/stop successfully.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const removeTransportFromStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { $unset: { transportDetails: '' } },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Transport removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getStudentsByRoute = async (req, res) => {
  try {
    const students = await Student.find({ 'transportDetails.route': req.params.routeId })
      .populate('transportDetails.vehicle', 'vehicleNo')
      .select('firstName lastName admissionNumber class transportDetails');
    res.status(200).json(students);
  } catch (error) { res.status(500).json({ message: error.message }); }
};





const TransportAttendance = require('../models/transportAttendanceModel');
const TransportOutPass = require('../models/transportOutPassModel');

// @desc    Mark Transport Attendance
// @route   POST /api/transport/attendance
// @access  Private (Admin/Staff)
const markAttendance = async (req, res) => {
  try {
    const { date, route, tripType, stop, records } = req.body;

    // Check if record exists for this date, route, trip
    let attendance = await TransportAttendance.findOne({ date, route, tripType, stop });

    if (attendance) {
      // Update existing records
      attendance.records = records;
      attendance.createdBy = req.user?._id;
    } else {
      // Create new
      attendance = new TransportAttendance({
        date,
        route,
        tripType,
        stop,
        records,
        createdBy: req.user?._id
      });
    }

    const saved = await attendance.save();
    res.status(200).json({ message: 'Attendance saved successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Transport Attendance
// @route   GET /api/transport/attendance
// @access  Private (Admin/Staff)
const getAttendance = async (req, res) => {
  try {
    const { date, tripType } = req.query;
    let query = {};
    if (date) query.date = date;
    if (tripType && tripType !== 'All') query.tripType = tripType;

    const attendances = await TransportAttendance.find(query).populate('records.studentId', 'personalDetails.firstName personalDetails.lastName academicDetails.class academicDetails.section academicDetails.admissionNo personalDetails.fatherDetails.fatherName personalDetails.fatherDetails.mobileNo');
    
    // Format for frontend
    const formatted = [];
    attendances.forEach(att => {
      att.records.forEach(r => {
        if (r.studentId) {
          formatted.push({
            id: r.studentId._id,
            adm: r.studentId.academicDetails?.admissionNo || '-',
            name: `${r.studentId.personalDetails?.firstName || ''} ${r.studentId.personalDetails?.lastName || ''}`.trim(),
            father: r.studentId.personalDetails?.fatherDetails?.fatherName || '-',
            cls: `${r.studentId.academicDetails?.class || ''} ${r.studentId.academicDetails?.section || ''}`.trim(),
            contact: r.studentId.personalDetails?.fatherDetails?.mobileNo || '-',
            date: att.date.toISOString().split('T')[0],
            tripType: att.tripType,
            route: att.route,
            stop: att.stop,
            morningStatus: r.morningStatus,
            afternoonStatus: r.afternoonStatus
          });
        }
      });
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Students for Attendance (Mock filter if no transport data on student)
// @route   GET /api/transport/students
// @access  Private (Admin/Staff)
const getTransportStudents = async (req, res) => {
  try {
    // For now, fetch all students because they don't have route assignments yet
    const students = await Student.find({}).select('personalDetails.firstName personalDetails.lastName academicDetails.class academicDetails.section academicDetails.admissionNo personalDetails.fatherDetails.fatherName personalDetails.fatherDetails.mobileNo');
    
    const formatted = students.map((s, index) => ({
      id: s._id,
      adm: s.academicDetails?.admissionNo || `00${index+1}`,
      name: `${s.personalDetails?.firstName || ''} ${s.personalDetails?.lastName || ''}`.trim(),
      father: s.personalDetails?.fatherDetails?.fatherName || '-',
      cls: `${s.academicDetails?.class || ''} ${s.academicDetails?.section || ''}`.trim(),
      contact: s.personalDetails?.fatherDetails?.mobileNo || '-'
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Out Pass
// @route   POST /api/transport/outpass
// @access  Private (Admin/Staff)
const createOutPass = async (req, res) => {
  try {
    const { studentId, className, section, assignDate, endDate } = req.body;
    
    const outpass = new TransportOutPass({
      studentId,
      className,
      section,
      assignDate,
      endDate,
      createdBy: req.user?._id
    });

    const saved = await outpass.save();
    res.status(201).json({ message: 'Out pass created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Out Passes
// @route   GET /api/transport/outpass
// @access  Private (Admin/Staff)
const getOutPasses = async (req, res) => {
  try {
    const passes = await TransportOutPass.find({}).populate('studentId', 'personalDetails.firstName personalDetails.lastName academicDetails.admissionNo personalDetails.fatherDetails.mobileNo');
    
    const formatted = passes.map(p => ({
      id: p._id,
      adm: p.studentId?.academicDetails?.admissionNo || '-',
      name: `${p.studentId?.personalDetails?.firstName || ''} ${p.studentId?.personalDetails?.lastName || ''}`.trim(),
      contact: p.studentId?.personalDetails?.fatherDetails?.mobileNo || '-',
      cls: p.className,
      section: p.section,
      assignDate: p.assignDate.toISOString().split('T')[0],
      endDate: p.endDate.toISOString().split('T')[0]
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
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
  markAttendance,
  getAttendance,
  getTransportStudents,
  createOutPass,
  getOutPasses
};
