const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');
const TransferCertificate = require('../models/transferCertificateModel');

// GET /api/dashboard/admission-stats
router.get('/', async (req, res) => {
  try {
    const daysParam = parseInt(req.query.days) || 7;
    const requestedStandard = (req.query.standard || 'NUR').toString().trim().toUpperCase();

    // Fetch all real students from MongoDB
    const students = await Student.find({}).lean();
    const totalStudents = students.length;

    // Helper to normalize class names (e.g. 'Class 5' -> '5', 'NUR' -> 'NUR')
    const normalizeClass = (cls) => {
      if (!cls) return '';
      const c = cls.toString().trim().toUpperCase();
      return c.replace(/^CLASS\s+/, '');
    };

    // 1. Real Student Head Count (YTD)
    const boysCount = students.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
    const girlsCount = students.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'female').length;
    const boysPercent = totalStudents > 0 ? Math.round((boysCount / totalStudents) * 100) : 0;
    const girlsPercent = totalStudents > 0 ? Math.round((girlsCount / totalStudents) * 100) : 0;

    // 2. Real New Admission Statistics
    // A student is new admission if admissionStatus is 'New Admission' or admission date is in 2026
    const newAdmissions = students.filter(s => {
      const status = (s.academicDetails?.admissionStatus || '').toLowerCase();
      const admDate = s.academicDetails?.dateOfAdmission ? new Date(s.academicDetails.dateOfAdmission) : null;
      return status === 'new admission' || (admDate && admDate.getFullYear() >= 2026);
    });

    const newAdmTotal = newAdmissions.length;
    const regAtSchool = newAdmTotal;
    const onlineReg = 0;

    // 3. Year-over-Year (Current session vs Previous sessions)
    const prevYearStudents = students.filter(s => {
      if (!s.academicDetails?.dateOfAdmission) return false;
      const d = new Date(s.academicDetails.dateOfAdmission);
      return d.getFullYear() < 2026;
    });

    const prevYearNewAdmBoys = prevYearStudents.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
    const prevYearNewAdmGirls = prevYearStudents.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'female').length;
    const newAdmBoysCount = newAdmissions.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
    const newAdmGirlsCount = newAdmissions.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'female').length;

    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? '+100.00' : '0.00';
      return (((curr - prev) / prev) * 100).toFixed(2);
    };

    const newAdmBoysChange = calcChange(newAdmBoysCount, prevYearNewAdmBoys);
    const newAdmGirlsChange = calcChange(newAdmGirlsCount, prevYearNewAdmGirls);

    // 4. Student Statistics (vs. Prev Year)
    const prevBoys = prevYearStudents.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
    const prevGirls = prevYearStudents.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'female').length;
    const boysChange = calcChange(boysCount, prevBoys);
    const girlsChange = calcChange(girlsCount, prevGirls);

    // 5. Real Standard Wise Strength
    const standardsOrder = ['NUR', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const standardWiseStrength = [];
    const allStandardsStats = {};

    standardsOrder.forEach(std => {
      const inClass = students.filter(s => normalizeClass(s.academicDetails?.class) === std);
      const totalInClass = inClass.length;

      const newInClass = inClass.filter(s => {
        const status = (s.academicDetails?.admissionStatus || '').toLowerCase();
        const admDate = s.academicDetails?.dateOfAdmission ? new Date(s.academicDetails.dateOfAdmission) : null;
        return status === 'new admission' || (admDate && admDate.getFullYear() >= 2026);
      }).length;

      const boysInClass = inClass.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
      const girlsInClass = inClass.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'female').length;
      const oldInClass = Math.max(0, totalInClass - newInClass);

      standardWiseStrength.push({
        name: std,
        total: totalInClass,
        newAdm: newInClass
      });

      const newPercent = totalInClass > 0 ? Math.round((newInClass / totalInClass) * 100) : 0;
      const oldPercent = totalInClass > 0 ? (100 - newPercent) : 0;

      allStandardsStats[std] = {
        class: std,
        total: totalInClass,
        boys: boysInClass,
        girls: girlsInClass,
        newAdmission: newInClass,
        newAdmissionPercent: newPercent,
        old: oldInClass,
        oldPercent: oldPercent,
        tcTaken: 0,
        tcTakenPercent: 0
      };
    });

    // 6. Real Transfer Certificate Statistics
    const tcs = await TransferCertificate.find({}).lean();
    const totalTcs = tcs.length;
    const draftedCount = tcs.filter(t => t.status === 'Draft').length;
    const generatedCount = tcs.filter(t => t.status === 'Generated').length;
    const cancelledCount = tcs.filter(t => t.status === 'Cancelled').length;

    const draftedPercent = totalTcs > 0 ? Math.round((draftedCount / totalTcs) * 100) : 0;
    const generatedPercent = totalTcs > 0 ? Math.round((generatedCount / totalTcs) * 100) : 0;
    const cancelledPercent = totalTcs > 0 ? Math.max(0, 100 - draftedPercent - generatedPercent) : 0;

    const tcStats = {
      total: totalTcs,
      drafted: draftedCount,
      draftedPercent,
      generated: generatedCount,
      generatedPercent,
      cancelled: cancelledCount,
      cancelledPercent
    };

    // 7. Comparison Data
    const leftCount = students.filter(s => (s.academicDetails?.currentStatus || '').toUpperCase() === 'LEFT').length;
    const comparisonData = [
      { label: 'TOTAL STUDENT', curr: totalStudents, prev: prevYearStudents.length },
      { label: 'BOYS', curr: boysCount, prev: prevBoys },
      { label: 'GIRLS', curr: girlsCount, prev: prevGirls },
      { label: 'NEW ADMISSION', curr: newAdmTotal, prev: prevYearStudents.length },
      { label: 'TC TAKEN', curr: generatedCount, prev: 0 },
      { label: 'LEFT', curr: leftCount, prev: 0 }
    ];

    // 8. Real New Admission by Period (7, 15, 30 days)
    const now = new Date();
    const periodDays = [7, 15, 30].includes(daysParam) ? daysParam : 7;
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    const dateRangeLabel = `${fmt(startDate)} TO ${fmt(now)}`;

    const periodAdmissions = newAdmissions.filter(s => {
      if (!s.academicDetails?.dateOfAdmission) return false;
      const d = new Date(s.academicDetails.dateOfAdmission);
      return d >= startDate && d <= now;
    });

    const periodTotal = periodAdmissions.length;
    const periodBoys = periodAdmissions.filter(s => (s.personalDetails?.gender || '').toLowerCase() === 'male').length;
    const periodGirls = periodTotal - periodBoys;
    const periodBoysPercent = periodTotal > 0 ? Math.round((periodBoys / periodTotal) * 100) : 0;
    const periodGirlsPercent = periodTotal > 0 ? (100 - periodBoysPercent) : 0;

    const newAdmissionByPeriod = {
      days: periodDays,
      dateRangeLabel: dateRangeLabel.toUpperCase(),
      total: periodTotal,
      boys: periodBoys,
      boysPercent: periodBoysPercent,
      girls: periodGirls,
      girlsPercent: periodGirlsPercent
    };

    // 9. Real Religion Wise Distribution
    const religionColors = {
      'HINDU': '#fbc531',
      'O.B.C.': '#55efc4',
      'S.C.': '#dfe6e9',
      'GENERAL': '#e17055',
      'S.T.': '#fd79a8',
      'MUSLIM': '#00a2db',
      'SIKH': '#e67e22',
      'CHRISTIAN': '#9b59b6',
      'NA': '#b2bec3'
    };

    const religionCounts = {};
    students.forEach(s => {
      const rel = (s.personalDetails?.religion || 'NA').toString().trim().toUpperCase();
      religionCounts[rel] = (religionCounts[rel] || 0) + 1;
    });

    const religionWiseStats = Object.keys(religionCounts).map(name => {
      const count = religionCounts[name];
      const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
      return {
        name,
        count,
        percent,
        color: religionColors[name] || '#6c5ce7'
      };
    }).sort((a, b) => b.count - a.count);

    // 10. Real Category Wise Distribution
    const categoryColors = {
      'Gen': '#d35400',
      'General': '#d35400',
      'OBC': '#fbc531',
      'SC': '#55efc4',
      'ST': '#fd79a8',
      'NA': '#b2bec3'
    };

    const categoryCounts = {};
    students.forEach(s => {
      let cat = s.personalDetails?.schoolCategory || s.personalDetails?.caste || 'NA';
      if (cat.toLowerCase() === 'general') cat = 'Gen';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryWiseStats = Object.keys(categoryCounts).map(name => {
      const count = categoryCounts[name];
      const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
      return {
        name,
        count,
        percent,
        color: categoryColors[name] || '#00a2db'
      };
    }).sort((a, b) => b.count - a.count);

    // Selected class stats
    const stdStats = allStandardsStats[requestedStandard] || allStandardsStats['NUR'];

    res.json({
      headCount: {
        total: totalStudents,
        boys: boysCount,
        boysPercent,
        girls: girlsCount,
        girlsPercent
      },
      newAdmissionStats: {
        total: newAdmTotal,
        schoolReg: regAtSchool,
        schoolRegPercent: newAdmTotal > 0 ? 100 : 0,
        onlineReg,
        onlineRegPercent: 0
      },
      newAdmissionRatioVsPrevYear: {
        boys: { current: newAdmBoysCount, previous: prevYearNewAdmBoys, changePercent: newAdmBoysChange },
        girls: { current: newAdmGirlsCount, previous: prevYearNewAdmGirls, changePercent: newAdmGirlsChange }
      },
      studentStatsVsPrevYear: {
        boys: { current: boysCount, previous: prevBoys, changePercent: boysChange },
        girls: { current: girlsCount, previous: prevGirls, changePercent: girlsChange }
      },
      standardWiseStrength,
      comparisonData,
      newAdmissionByPeriod,
      standardWiseStats: stdStats,
      allStandardsStats,
      religionWiseStats,
      tcStats,
      categoryWiseStats
    });

  } catch (err) {
    console.error('Admission stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
