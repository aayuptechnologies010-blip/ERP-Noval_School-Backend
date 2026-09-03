const FeeReceipt = require('../models/feeReceiptModel');
const Student = require('../models/studentModel');
const mongoose = require('mongoose');

// ========================
// DAILY FEE COLLECTION
// ========================
const getDailyFeeCollection = async (req, res) => {
  try {
    const { startDate, endDate, payMode, classId } = req.query;
    
    let matchStage = { status: 'Successful' };
    
    if (startDate && endDate) {
      matchStage.receiptDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)) 
      };
    } else if (startDate) {
      matchStage.receiptDate = { $gte: new Date(startDate) };
    }
    
    if (payMode) {
      matchStage.paymentMode = payMode;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' }
    ];

    if (classId) {
      pipeline.push({
        $match: { 'studentInfo.academicDetails.class': classId }
      });
    }

    // Grouping by Date and Paymode
    pipeline.push({
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$receiptDate" } },
          paymentMode: "$paymentMode"
        },
        totalAmount: { $sum: "$amountPaid" },
        count: { $sum: 1 },
        receipts: { 
          $push: {
            receiptNo: "$receiptNo",
            amountPaid: "$amountPaid",
            studentName: { $concat: ["$studentInfo.personalDetails.firstName", " ", "$studentInfo.personalDetails.lastName"] },
            admissionNo: "$studentInfo.academicDetails.admissionNumber",
            class: "$studentInfo.academicDetails.class",
            paymentMode: "$paymentMode",
            referenceNumber: "$referenceNumber",
            bankName: "$bankName",
            chequeStatus: "$chequeStatus"
          } 
        }
      }
    });

    pipeline.push({ $sort: { "_id.date": -1 } });

    const results = await FeeReceipt.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// MONTHLY FEE COLLECTION
// ========================
const getMonthWiseCollection = async (req, res) => {
  try {
    const { year, payMode } = req.query;
    
    let matchStage = { status: 'Successful' };
    if (payMode) matchStage.paymentMode = payMode;

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            month: { $month: "$receiptDate" },
            year: { $year: "$receiptDate" },
            paymentMode: "$paymentMode"
          },
          totalAmount: { $sum: "$amountPaid" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ];

    if (year) {
      pipeline.unshift({
        $match: {
          receiptDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      });
    }

    const results = await FeeReceipt.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// TOTAL COLLECTION (SUMMARY)
// ========================
const getTotalCollection = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: 'Successful' } },
      {
        $group: {
          _id: "$paymentMode",
          totalAmount: { $sum: "$amountPaid" },
          totalDiscount: { $sum: "$discountAmount" },
          count: { $sum: 1 }
        }
      }
    ];

    const results = await FeeReceipt.aggregate(pipeline);
    
    let grandTotal = 0;
    results.forEach(r => grandTotal += r.totalAmount);

    res.status(200).json({ summary: results, grandTotal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// DEFAULTER LIST
// ========================
const getDefaulterList = async (req, res) => {
  try {
    const { classId, status } = req.query;
    const StudentFeeLedger = require('../models/studentFeeLedgerModel');

    let matchStage = {};
    if (status !== 'all') {
      matchStage.totalDues = { $gt: 0 };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' }
    ];

    if (classId) {
      pipeline.push({
        $match: { 'studentInfo.academicDetails.class': classId }
      });
    }

    pipeline.push({
      $project: {
        admissionNo: '$studentInfo.academicDetails.admissionNumber',
        studentName: { $concat: ['$studentInfo.personalDetails.firstName', ' ', '$studentInfo.personalDetails.lastName'] },
        class: '$studentInfo.academicDetails.class',
        mobileNumber: '$studentInfo.contactDetails.mobileNumber',
        fatherName: '$studentInfo.parentsDetails.fatherName',
        totalPayable: 1,
        totalDues: 1,
        totalPaid: 1,
        totalConcession: 1,
        advanceAmount: 1,
        lastPaymentDate: 1
      }
    });

    pipeline.push({ $sort: { totalDues: -1 } });

    const results = await StudentFeeLedger.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDailyFeeCollection,
  getMonthWiseCollection,
  getTotalCollection,
  getDefaulterList
};
