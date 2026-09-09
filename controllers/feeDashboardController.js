const FeeReceipt = require('../models/feeReceiptModel');
const StudentFeeLedger = require('../models/studentFeeLedgerModel');
const mongoose = require('mongoose');

// Collection Summary (Standard Wise) - filtered by days
const getCollectionSummary = async (req, res) => {
  try {
    const { filter } = req.query; // 'today', '7days', '30days'
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (filter === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    }

    const pipeline = [
      {
        $match: {
          status: 'Successful',
          receiptDate: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: "$studentInfo.academicDetails.class",
          amount: { $sum: "$amountPaid" }
        }
      }
    ];

    const results = await FeeReceipt.aggregate(pipeline);

    // Get payment mode breakdown
    const paymentModePipeline = [
      {
        $match: {
          status: 'Successful',
          receiptDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$paymentMode",
          amount: { $sum: "$amountPaid" },
          transactions: { $sum: 1 }
        }
      }
    ];
    const paymentModeResults = await FeeReceipt.aggregate(paymentModePipeline);

    res.status(200).json({
      standardWise: results.map(r => ({ standard: r._id, amount: r.amount })),
      paymentModes: paymentModeResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Defaulter Statistics (Standard Wise)
const getDefaulterStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          totalDues: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: "$studentInfo.academicDetails.class",
          amount: { $sum: "$totalDues" },
          defaulterCount: { $sum: 1 }
        }
      }
    ];

    const results = await StudentFeeLedger.aggregate(pipeline);
    
    // Total active students count
    const Student = require('../models/studentModel');
    const totalStudents = await Student.countDocuments({ status: 'Active' });

    let totalDueAmount = 0;
    let totalDefaulters = 0;
    
    const formattedData = results.map(r => {
      totalDueAmount += r.amount;
      totalDefaulters += r.defaulterCount;
      return { std: r._id, amount: r.amount };
    });

    res.status(200).json({
      standardWise: formattedData,
      totalDueAmount,
      totalDefaulters,
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transaction History of Last 30 Days (Date Wise)
const getTransactionHistory = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          status: 'Successful',
          receiptDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$receiptDate" } },
          value: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const results = await FeeReceipt.aggregate(pipeline);
    
    // Format dates like '30-Jul'
    const formattedData = results.map(r => {
      const d = new Date(r._id);
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleString('en-US', { month: 'short' });
      return {
        date: `${day}-${month}`,
        value: r.value
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fee Revenue Summary (YTD)
const getRevenueSummary = async (req, res) => {
  try {
    const ledgerStats = await StudentFeeLedger.aggregate([
      {
        $group: {
          _id: null,
          totalPayable: { $sum: "$totalPayable" },
          totalReceived: { $sum: "$totalPaid" },
          totalDue: { $sum: "$totalDues" },
          totalConcession: { $sum: "$totalConcession" }
        }
      }
    ]);

    const stats = ledgerStats[0] || {
      totalPayable: 0,
      totalReceived: 0,
      totalDue: 0,
      totalConcession: 0
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Estimated Collection (Month Wise / Installment Wise mockup - we will just group receipts by month for now and dues by some logic or just return YTD)
// For simplicity, we'll return receipt amounts grouped by month for the current year
const getEstimatedCollection = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-04-01`); // Assuming April to March session
    
    const pipeline = [
      {
        $match: {
          status: 'Successful',
          receiptDate: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: { $month: "$receiptDate" },
          Received: { $sum: "$amountPaid" },
          Concession: { $sum: "$discountAmount" }
        }
      }
    ];

    const receipts = await FeeReceipt.aggregate(pipeline);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // As a simplification, we'll just populate Received. Estimated and Due requires complex Installment logic which might not be fully seeded.
    const formattedData = months.map((month, index) => {
      const monthNum = index + 1;
      const found = receipts.find(r => r._id === monthNum);
      return {
        month,
        Estimated: 0, // Placeholder
        Received: found ? found.Received : 0,
        Concession: found ? found.Concession : 0,
        Due: 0 // Placeholder
      };
    });
    
    // Sort to start from April
    const sortedData = [...formattedData.slice(3), ...formattedData.slice(0, 3)];

    res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recent Transactions
const getRecentTransactions = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: 'Successful' } },
      { $sort: { receiptDate: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          receiptNo: 1,
          amountPaid: 1,
          receiptDate: 1,
          paymentMode: 1,
          studentName: { $concat: ["$studentInfo.personalDetails.firstName", " ", "$studentInfo.personalDetails.lastName"] },
          class: "$studentInfo.academicDetails.class",
          admissionNumber: "$studentInfo.academicDetails.admissionNumber"
        }
      }
    ];

    const results = await FeeReceipt.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Headcount
const getStudentHeadcount = async (req, res) => {
  try {
    const Student = require('../models/studentModel');
    
    const pipeline = [
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: "$personalDetails.gender",
          count: { $sum: 1 }
        }
      }
    ];

    const results = await Student.aggregate(pipeline);
    
    let total = 0;
    let boys = 0;
    let girls = 0;
    
    results.forEach(r => {
      total += r.count;
      const gender = (r._id || '').toLowerCase();
      if (gender === 'male' || gender === 'boy') boys += r.count;
      else if (gender === 'female' || gender === 'girl') girls += r.count;
    });

    res.status(200).json({ total, boys, girls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCollectionSummary,
  getDefaulterStats,
  getTransactionHistory,
  getRevenueSummary,
  getEstimatedCollection,
  getRecentTransactions,
  getStudentHeadcount
};
