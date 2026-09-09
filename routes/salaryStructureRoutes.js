const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
  // Leave LWP
  getLeaveLWP, saveLeaveLWP,

  // Occasional Allowance
  getOccasionalAllowances, saveOccasionalAllowance, deleteOccasionalAllowance,

  // Salary Generation
  getSalaryPayrolls, generateMonthlySalary, updateSalaryStatus,

  // Statements
  getBankStatement, getInsuranceStatement, getChequeStatement,

  // IT Head
  getITHeadEntries, saveITHeadEntry,

  // TDS
  getTDSEntries, saveTDSEntry,

  // Gratuity
  getGratuity, calculateGratuity,

  // Bonus
  getBonus, calculateBonus,

  // Increment
  getIncrements, applyIncrement, rollbackIncrement,

  // Staff Salary Structure
  getStaffSalaryStructures,

  // Generate Salary Status
  getSalaryStatusRecords,

  // Daily Wages
  getDailyWages, saveDailyWages, updateDailyWages,

  // Salary Reports
  getHeadWiseReport, sendSalarySMS, sendSalarySlipMail,

  // Income Tax Modules
  getTDSEntryReport,
  getQuarterlyForm24Q,
  getAnnualTDS24Q,
  getGrossForm16,
  getForm16Certificate,
  getTDSAnalyticsReport,

  // Monthly Salary Reports & Associated Modules
  getEmployeeTypeWiseReport,
  getEstimatedSalaryReport,
  getDepartmentWiseReport,
  getConsolidatedSalaryStatement,
  getGrossSalaryReport,
  getMonthWiseSalaryReport,
  getMonthlySummaryReport,
  getHeadWiseGrossSalaryReport,
  getStaffStatement,
  getYearlyReconciliationReport,
  getAnnualSalaryPaidReport,
  getYearlyEmployeeStatement,
  getSalaryCertificateReport,
  getIncomeTaxReport,
  getProfessionalTaxReport,
  getChequeStatementReport,
  getMonthlyReportsFilterOptions,
  importAyupTechData,
  // Phase 1 Statutory & Social Security Reports
  getPFReport,
  getPFChallanReport,
  getPFStatement,
  getPFAnnualReport,
  getESIReport,
  getESIAnnualReport,
  getGSLIReport,
  // Phase 2 Career Progression & Terminal Benefits Reports
  getIncrementReport,
  getMACPListReport,
  getFixationReport,
  getGratuityReport,
  getSuperAnnunciationReport,
  // Phase 3 Retirement, Pension & Service Track Reports
  getDateRangeRetirementReport,
  getRetirementReport,
  getPensionListReport,
  getServiceReport,
  getExperienceCertificateReport,
  getEmployeeBioDataReport,
  // Phase 4 Analytics, Comparative Studies & Communication Reports
  getEmployeeStatisticsReport,
  getSalaryCompareReport,
  getComparisonReport,
  getSMSReport
} = require('../controllers/salaryStructureController');

// Optional Auth middleware that parses token if valid, but allows guest/unauthenticated read access
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const jwt = require('jsonwebtoken');
        const Admin = require('../models/adminModel');
        const Staff = require('../models/staffModel');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userType === 'staff') {
          req.user = await Staff.findById(decoded.id).select('-password');
        } else {
          req.user = await Admin.findById(decoded.id).select('-password');
        }
      }
    }
  } catch (e) {
    // Token expired or invalid, continue smoothly
  }
  next();
};

// Report and statement endpoints allow both authenticated and unauthenticated read access
router.route('/salary-generation').get(optionalAuth, getSalaryPayrolls).post(protect, generateMonthlySalary);
router.route('/salary-generation/:id/status').put(protect, updateSalaryStatus);

router.route('/bank-statement').get(optionalAuth, getBankStatement);
router.route('/insurance-statement').get(optionalAuth, getInsuranceStatement);
router.route('/cheque-statement').get(optionalAuth, getChequeStatement);

router.route('/head-wise-report').get(optionalAuth, getHeadWiseReport);
router.route('/salary-sheet/sms').post(optionalAuth, sendSalarySMS);
router.route('/salary-slip/mail').post(optionalAuth, sendSalarySlipMail);

// Income Tax & TDS Endpoints
router.route('/tds-entry-report').get(optionalAuth, getTDSEntryReport);
router.route('/form-24q').get(optionalAuth, getQuarterlyForm24Q);
router.route('/annual-24q').get(optionalAuth, getAnnualTDS24Q);
router.route('/gross-form16').get(optionalAuth, getGrossForm16);
router.route('/form-16-certificate').get(optionalAuth, getForm16Certificate);
router.route('/tds-analytics-report').get(optionalAuth, getTDSAnalyticsReport);

// Monthly Salary Reports & Associated Endpoints
router.route('/employee-type-wise-report').get(optionalAuth, getEmployeeTypeWiseReport);
router.route('/estimated-salary-report').get(optionalAuth, getEstimatedSalaryReport);
router.route('/department-wise-report').get(optionalAuth, getDepartmentWiseReport);
router.route('/consolidated-salary-statement').get(optionalAuth, getConsolidatedSalaryStatement);
router.route('/gross-salary-report').get(optionalAuth, getGrossSalaryReport);
router.route('/month-wise-salary-report').get(optionalAuth, getMonthWiseSalaryReport);
router.route('/monthly-summary-report').get(optionalAuth, getMonthlySummaryReport);
router.route('/head-wise-gross-salary-report').get(optionalAuth, getHeadWiseGrossSalaryReport);
router.route('/staff-statement').get(optionalAuth, getStaffStatement);
router.route('/monthly-reports-filter-options').get(optionalAuth, getMonthlyReportsFilterOptions);
router.route('/import-ayup-tech-data').post(optionalAuth, importAyupTechData);

// Yearly Reports Endpoints
router.route('/yearly-reconciliation-report').get(optionalAuth, getYearlyReconciliationReport);
router.route('/annual-salary-paid-report').get(optionalAuth, getAnnualSalaryPaidReport);
router.route('/yearly-employee-statement').get(optionalAuth, getYearlyEmployeeStatement);
router.route('/salary-certificate-report').get(optionalAuth, getSalaryCertificateReport);

// Tax & Cheque Reports Endpoints
router.route('/income-tax-report').get(optionalAuth, getIncomeTaxReport);
router.route('/professional-tax-report').get(optionalAuth, getProfessionalTaxReport);
router.route('/cheque-statement-report').get(optionalAuth, getChequeStatementReport);

// Phase 1: Statutory & Social Security Reports Endpoints
router.route('/pf-report').get(optionalAuth, getPFReport);
router.route('/pf-challan-report').get(optionalAuth, getPFChallanReport);
router.route('/pf-statement').get(optionalAuth, getPFStatement);
router.route('/pf-annual-report').get(optionalAuth, getPFAnnualReport);
router.route('/esi-report').get(optionalAuth, getESIReport);
router.route('/esi-annual-report').get(optionalAuth, getESIAnnualReport);
router.route('/gsli-report').get(optionalAuth, getGSLIReport);

// Phase 2: Career Progression & Terminal Benefits Reports Endpoints
router.route('/increment-report').get(optionalAuth, getIncrementReport);
router.route('/macp-list-report').get(optionalAuth, getMACPListReport);
router.route('/fixation-report').get(optionalAuth, getFixationReport);
router.route('/gratuity-report').get(optionalAuth, getGratuityReport);
router.route('/super-annunciation-report').get(optionalAuth, getSuperAnnunciationReport);

// Phase 3: Retirement, Pension & Service Track Reports Endpoints
router.route('/date-range-retirement-report').get(optionalAuth, getDateRangeRetirementReport);
router.route('/retirement-report').get(optionalAuth, getRetirementReport);
router.route('/pension-list-report').get(optionalAuth, getPensionListReport);
router.route('/service-report').get(optionalAuth, getServiceReport);
router.route('/experience-certificate-report').get(optionalAuth, getExperienceCertificateReport);
router.route('/employee-bio-data-report').get(optionalAuth, getEmployeeBioDataReport);

// Phase 4: Analytics, Comparative Studies & Communication Reports Endpoints
router.route('/employee-statistics-report').get(optionalAuth, getEmployeeStatisticsReport);
router.route('/salary-compare-report').get(optionalAuth, getSalaryCompareReport);
router.route('/comparison-report').get(optionalAuth, getComparisonReport);
router.route('/sms-report').get(optionalAuth, getSMSReport);

// All other modification endpoints protected with JWT
router.use(protect);

// 1. Leave LWP Manual
router.route('/leave-lwp').get(getLeaveLWP).post(saveLeaveLWP);

// 2. Occasional Allowance & Deductions
router.route('/occasional-allowance').get(getOccasionalAllowances).post(saveOccasionalAllowance);
router.route('/occasional-allowance/:id').delete(deleteOccasionalAllowance);

// 5. IT Head Entries
router.route('/it-head-entries').get(getITHeadEntries).post(saveITHeadEntry);

// 6. TDS Entries
router.route('/tds-entries').get(getTDSEntries).post(saveTDSEntry);

// 7. Gratuity Calculations
router.route('/gratuity').get(getGratuity).post(calculateGratuity);

// 8. Bonus Calculations
router.route('/bonus').get(getBonus).post(calculateBonus);

// 9. Auto Increment
router.route('/increment').get(getIncrements).post(applyIncrement);
router.route('/increment/:id/rollback').put(rollbackIncrement);

// 10. Staff Salary Structure
router.route('/staff-salary-structure').get(getStaffSalaryStructures);

// 11. Generate Salary Status
router.route('/salary-status').get(getSalaryStatusRecords);

// 12. Daily Wages Attendance
router.route('/daily-wages').get(getDailyWages).post(saveDailyWages);
router.route('/daily-wages/:id').put(updateDailyWages);

module.exports = router;
