const FeeReceipt = require('../models/feeReceiptModel');
const StudentFeeLedger = require('../models/studentFeeLedgerModel');
const Student = require('../models/studentModel');

// @desc    Add a Manual Fee (Increases Dues)
// @route   POST /api/fee-transactions/add-manual-fee
// @access  Private
const addManualFee = async (req, res) => {
  try {
    const { studentId, amount, headName, remarks } = req.body;
    if (!studentId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Student ID and valid Amount are required' });
    }

    let ledger = await StudentFeeLedger.findOne({ student: studentId });
    if (!ledger) {
      ledger = new StudentFeeLedger({
        student: studentId,
        totalPayable: 0,
        totalPaid: 0,
        totalDues: 0,
        totalConcession: 0,
        advanceAmount: 0
      });
    }

    // A manual fee increases the total payable and dues
    ledger.totalPayable += Number(amount);
    ledger.totalDues += Number(amount);
    await ledger.save();

    res.status(200).json({ message: `Manual fee of ${amount} added for ${headName || 'Custom Head'}`, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Receipt Metadata in Bulk (e.g. Bank Date, Deposit Bank)
// @route   PUT /api/fee-transactions/bulk-update-metadata
// @access  Private
const updateBulkReceiptMetadata = async (req, res) => {
  try {
    const { receiptIds, updates } = req.body; // updates: { receiptDate, depositBank, chequeDate }

    if (!receiptIds || !Array.isArray(receiptIds) || receiptIds.length === 0) {
      return res.status(400).json({ message: 'No receipts selected for update' });
    }

    const updatePayload = {};
    if (updates.receiptDate) updatePayload.receiptDate = new Date(updates.receiptDate);
    if (updates.depositBank) updatePayload.depositBank = updates.depositBank;
    if (updates.chequeDate) updatePayload.chequeDate = new Date(updates.chequeDate);

    await FeeReceipt.updateMany(
      { _id: { $in: receiptIds } },
      { $set: updatePayload }
    );

    res.status(200).json({ message: `${receiptIds.length} receipts updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student fee ledger
// @route   GET /api/fee-transactions/ledger/:studentId
// @access  Private
const getStudentLedger = async (req, res) => {
  try {
    const { studentId } = req.params;
    let ledger = await StudentFeeLedger.findOne({ student: studentId }).populate('student');
    
    // If no ledger exists yet, create one with 0s
    if (!ledger) {
      ledger = await StudentFeeLedger.create({ student: studentId });
      ledger = await StudentFeeLedger.findOne({ student: studentId }).populate('student');
    }

    // Fetch all receipts for this student
    const receipts = await FeeReceipt.find({ student: studentId }).sort({ createdAt: -1 });
    
    res.status(200).json({ ledger, transactions: receipts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit fee payment (Create Receipt & Update Ledger)
// @route   POST /api/fee-transactions/pay
// @access  Private
const submitFeePayment = async (req, res) => {
  try {
    const { studentId, amountPaid, paymentMode, remarks, referenceNumber, bankName, chequeDate, discountAmount, advanceUsed } = req.body;

    if (!studentId || !amountPaid) {
      return res.status(400).json({ message: 'Student ID and Amount Paid are required' });
    }

    // Generate Receipt Number (Simple timestamp based for now)
    const receiptNo = `REC${Date.now()}`;

    // Create Receipt
    const receipt = await FeeReceipt.create({
      receiptNo,
      student: studentId,
      amountPaid,
      paymentMode,
      remarks,
      referenceNumber,
      bankName,
      chequeDate,
      discountAmount,
      advanceUsed
    });

    // Update Ledger
    let ledger = await StudentFeeLedger.findOne({ student: studentId });
    if (!ledger) {
      ledger = await StudentFeeLedger.create({ student: studentId });
    }

    // Logic: 
    // Advance used reduces advanceAmount
    // Amount paid decreases total dues and increases total paid
    // If amount paid is greater than dues, add to advance
    
    let effectivePayment = Number(amountPaid) + Number(advanceUsed || 0) + Number(discountAmount || 0);
    
    if (ledger.totalDues > 0) {
      if (effectivePayment >= ledger.totalDues) {
        ledger.advanceAmount += (effectivePayment - ledger.totalDues);
        ledger.totalDues = 0;
      } else {
        ledger.totalDues -= effectivePayment;
      }
    } else {
      ledger.advanceAmount += effectivePayment;
    }

    if (advanceUsed > 0) {
      ledger.advanceAmount -= Number(advanceUsed);
    }
    
    ledger.totalPaid += Number(amountPaid);
    ledger.lastPaymentDate = Date.now();
    
    await ledger.save();

    res.status(201).json({
      message: 'Fee payment successful',
      receipt,
      ledger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fee receipts
// @route   GET /api/fee-transactions/receipts
// @access  Private
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await FeeReceipt.find()
      .populate('student', 'firstName lastName admissionNumber rollNumber class section')
      .sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a fee receipt
// @route   PUT /api/fee-transactions/cancel/:id
// @access  Private
const cancelFeeReceipt = async (req, res) => {
  try {
    const { cancelledReason } = req.body;
    const receipt = await FeeReceipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'Cancelled') {
      return res.status(400).json({ message: 'Receipt is already cancelled' });
    }

    // Reverse ledger
    let ledger = await StudentFeeLedger.findOne({ student: receipt.student });
    if (ledger) {
      // Very basic reversal: if it went to totalPaid, we revert it
      ledger.totalPaid -= receipt.amountPaid;
      
      // Assume for simplicity it just adds back to dues. 
      // Real-world logic would be more complex depending on advance vs dues.
      ledger.totalDues += receipt.amountPaid;
      
      await ledger.save();
    }

    receipt.status = 'Cancelled';
    receipt.cancelledReason = cancelledReason || 'Cancelled by admin';
    await receipt.save();

    res.status(200).json({ message: 'Receipt cancelled successfully', receipt, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a fee receipt
// @route   DELETE /api/fee-transactions/:id
// @access  Private
const deleteFeeReceipt = async (req, res) => {
  try {
    const receipt = await FeeReceipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // If not already cancelled, we should theoretically reverse the ledger first
    if (receipt.status !== 'Cancelled') {
      let ledger = await StudentFeeLedger.findOne({ student: receipt.student });
      if (ledger) {
        ledger.totalPaid -= receipt.amountPaid;
        ledger.totalDues += receipt.amountPaid;
        await ledger.save();
      }
    }

    await receipt.deleteOne();

    res.status(200).json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Modify a fee receipt
// @route   PUT /api/fee-transactions/modify/:id
// @access  Private
const modifyFeeReceipt = async (req, res) => {
  try {
    const { remarks, paymentMode, bankName, referenceNumber, chequeDate } = req.body;
    const receipt = await FeeReceipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot modify a cancelled receipt' });
    }

    if (remarks !== undefined) receipt.remarks = remarks;
    if (paymentMode !== undefined) receipt.paymentMode = paymentMode;
    if (bankName !== undefined) receipt.bankName = bankName;
    if (referenceNumber !== undefined) receipt.referenceNumber = referenceNumber;
    if (chequeDate !== undefined) receipt.chequeDate = chequeDate;

    await receipt.save();

    res.status(200).json({ message: 'Receipt modified successfully', receipt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manual advanced modification of a fee receipt (changes amount/discount)
// @route   PUT /api/fee-transactions/manual-modify/:id
// @access  Private
const manualModifyFeeReceipt = async (req, res) => {
  try {
    const { amountPaid, discountAmount, reason } = req.body;
    const receipt = await FeeReceipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot modify a cancelled receipt' });
    }

    const oldAmount = receipt.amountPaid;
    const oldDiscount = receipt.discountAmount || 0;
    
    const newAmount = amountPaid !== undefined ? Number(amountPaid) : oldAmount;
    const newDiscount = discountAmount !== undefined ? Number(discountAmount) : oldDiscount;

    const diffAmount = newAmount - oldAmount;
    const diffDiscount = newDiscount - oldDiscount;
    const totalDiff = diffAmount + diffDiscount;

    // Adjust Ledger
    let ledger = await StudentFeeLedger.findOne({ student: receipt.student });
    if (ledger) {
      ledger.totalPaid += diffAmount;
      
      if (totalDiff > 0) {
        // We paid/discounted more, decrease dues or increase advance
        if (ledger.totalDues > 0) {
          if (totalDiff >= ledger.totalDues) {
            ledger.advanceAmount += (totalDiff - ledger.totalDues);
            ledger.totalDues = 0;
          } else {
            ledger.totalDues -= totalDiff;
          }
        } else {
          ledger.advanceAmount += totalDiff;
        }
      } else if (totalDiff < 0) {
        // We paid/discounted less, we need to claw back from advance or increase dues
        const absDiff = Math.abs(totalDiff);
        if (ledger.advanceAmount >= absDiff) {
          ledger.advanceAmount -= absDiff;
        } else {
          const remainingToClaw = absDiff - ledger.advanceAmount;
          ledger.advanceAmount = 0;
          ledger.totalDues += remainingToClaw;
        }
      }

      await ledger.save();
    }

    receipt.amountPaid = newAmount;
    receipt.discountAmount = newDiscount;
    if (reason) receipt.remarks = reason + (receipt.remarks ? ` | ${receipt.remarks}` : '');
    
    await receipt.save();

    res.status(200).json({ message: 'Receipt manually modified and ledger recalculated', receipt, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process a fee refund
// @route   POST /api/fee-transactions/refund
// @access  Private
const processRefund = async (req, res) => {
  try {
    const { studentId, refundAmount, reason } = req.body;

    if (!studentId || !refundAmount || Number(refundAmount) <= 0) {
      return res.status(400).json({ message: 'Student ID and valid Refund Amount are required' });
    }

    let ledger = await StudentFeeLedger.findOne({ student: studentId });
    if (!ledger) {
      return res.status(404).json({ message: 'Student ledger not found' });
    }

    // A refund logically decreases the total paid amount, or takes money out of advance.
    // For simplicity, we'll assume a refund means we give them money back, decreasing totalPaid.
    ledger.totalPaid -= Number(refundAmount);
    // If we are refunding them from advance, we reduce advance.
    if (ledger.advanceAmount >= Number(refundAmount)) {
      ledger.advanceAmount -= Number(refundAmount);
    } else {
      // If refund is more than advance, it increases dues (because they owe us again for the refunded amount, assuming it was paid against dues)
      const diff = Number(refundAmount) - ledger.advanceAmount;
      ledger.advanceAmount = 0;
      ledger.totalDues += diff;
    }

    await ledger.save();

    const receipt = await FeeReceipt.create({
      receiptNo: `REF${Date.now()}`,
      student: studentId,
      amountPaid: -Number(refundAmount), // Negative amount for refund
      paymentMode: 'Adjustment',
      transactionType: 'Refund',
      remarks: reason || 'Refund Processed'
    });

    res.status(200).json({ message: 'Refund processed successfully', receipt, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Adjust advance amount manually
// @route   POST /api/fee-transactions/adjust-advance
// @access  Private
const adjustAdvance = async (req, res) => {
  try {
    const { studentId, adjustmentAmount, reason, isAddition } = req.body;

    if (!studentId || !adjustmentAmount || Number(adjustmentAmount) <= 0) {
      return res.status(400).json({ message: 'Student ID and valid Adjustment Amount are required' });
    }

    let ledger = await StudentFeeLedger.findOne({ student: studentId });
    if (!ledger) {
      return res.status(404).json({ message: 'Student ledger not found' });
    }

    const amt = Number(adjustmentAmount);
    if (isAddition) {
      ledger.advanceAmount += amt;
    } else {
      if (ledger.advanceAmount < amt) {
        return res.status(400).json({ message: 'Cannot subtract more than the current advance amount' });
      }
      ledger.advanceAmount -= amt;
    }

    await ledger.save();

    const receipt = await FeeReceipt.create({
      receiptNo: `ADV${Date.now()}`,
      student: studentId,
      amountPaid: isAddition ? amt : -amt,
      paymentMode: 'Adjustment',
      transactionType: 'AdvanceAdjustment',
      remarks: reason || (isAddition ? 'Advance Added Manually' : 'Advance Deducted Manually')
    });

    res.status(200).json({ message: 'Advance adjusted successfully', receipt, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Cheque Status (Clear or Bounce)
// @route   PUT /api/fee-transactions/cheque-status/:id
// @access  Private
const updateChequeStatus = async (req, res) => {
  try {
    const { status, bounceReason } = req.body; // status should be 'Cleared' or 'Bounced'
    const receipt = await FeeReceipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.paymentMode !== 'Cheque' && receipt.paymentMode !== 'DD') {
      return res.status(400).json({ message: 'Only Cheque or DD can have their status updated this way' });
    }

    if (receipt.chequeStatus === status) {
      return res.status(400).json({ message: `Cheque is already marked as ${status}` });
    }

    // If cheque bounced, we need to reverse the ledger
    if (status === 'Bounced' && receipt.status !== 'Cancelled') {
      let ledger = await StudentFeeLedger.findOne({ student: receipt.student });
      if (ledger) {
        ledger.totalPaid -= receipt.amountPaid;
        ledger.totalDues += receipt.amountPaid;
        await ledger.save();
      }
      
      receipt.status = 'Cancelled'; // Mark receipt as cancelled if cheque bounced
      receipt.cancelledReason = bounceReason || 'Cheque Bounced';
    }

    receipt.chequeStatus = status;
    await receipt.save();

    res.status(200).json({ message: `Cheque status updated to ${status}`, receipt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download Sample Excel Template for Fee Upload
// @route   GET /api/fee-transactions/sample-template
// @access  Private
const downloadSampleFeeExcel = async (req, res) => {
  try {
    const XLSX = require('xlsx');

    const sampleData = [
      {
        'Admission No': 'NS-1001',
        'Student Name': 'Aarav Sharma',
        'Class': 'Class - X',
        'Amount Paid': 15000,
        'Payment Mode': 'Cash',
        'Receipt Date': '2026-08-15',
        'Receipt No': 'REC-1001',
        'Bank / Reference No': '',
        'Remarks': 'Quarter 1 Fee'
      },
      {
        'Admission No': 'NS-1002',
        'Student Name': 'Ananya Singh',
        'Class': 'Class - VIII',
        'Amount Paid': 12500,
        'Payment Mode': 'UPI',
        'Receipt Date': '2026-08-16',
        'Receipt No': 'REC-1002',
        'Bank / Reference No': 'UPI9876543210',
        'Remarks': 'Admission Installment'
      },
      {
        'Admission No': 'NS-1003',
        'Student Name': 'Rohan Patel',
        'Class': 'Class - V',
        'Amount Paid': 9000,
        'Payment Mode': 'Cheque',
        'Receipt Date': '2026-08-20',
        'Receipt No': 'REC-1003',
        'Bank / Reference No': 'CHQ-554421',
        'Remarks': 'HDFC Cheque'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Admission No
      { wch: 22 }, // Student Name
      { wch: 15 }, // Class
      { wch: 15 }, // Amount Paid
      { wch: 15 }, // Payment Mode
      { wch: 15 }, // Receipt Date
      { wch: 15 }, // Receipt No
      { wch: 22 }, // Bank / Reference No
      { wch: 25 }  // Remarks
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fee_Upload_Template');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Student_Fee_Upload_Sample_Template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating sample template:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk Upload Student Paid Fees from Excel/CSV
// @route   POST /api/fee-transactions/upload-excel
// @access  Private
const uploadBulkFeesExcel = async (req, res) => {
  try {
    const XLSX = require('xlsx');

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please select an Excel or CSV file to upload.' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ success: false, message: 'No sheets found in the uploaded workbook.' });
    }

    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ success: false, message: 'The uploaded sheet is empty.' });
    }

    // Load all students for fast matching
    const allStudents = await Student.find(
      {},
      'academicDetails personalDetails'
    ).lean();

    const admMap = new Map();
    const rollMap = new Map();
    const nameMap = new Map();

    for (const st of allStudents) {
      const adm = (st.academicDetails?.admissionNumber || '').toString().trim().toLowerCase();
      if (adm) admMap.set(adm, st);

      const roll = (st.academicDetails?.rollNumber || '').toString().trim().toLowerCase();
      const cls = (st.academicDetails?.class || '').toString().trim().toLowerCase();
      if (roll && cls) rollMap.set(`${cls}_${roll}`, st);

      const fName = (st.personalDetails?.firstName || '').toString().trim().toLowerCase();
      const lName = (st.personalDetails?.lastName || '').toString().trim().toLowerCase();
      const fullName = `${fName} ${lName}`.trim();
      if (fullName) nameMap.set(fullName, st);
    }

    const successful = [];
    const failed = [];
    let rowIdx = 1;

    for (const row of rawRows) {
      rowIdx++;
      
      // Helper to find value from row with multiple possible header keys
      const getValue = (patterns, defaultVal = '') => {
        for (const key of Object.keys(row)) {
          const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          for (const pattern of patterns) {
            if (cleanKey.includes(pattern)) {
              return row[key];
            }
          }
        }
        return defaultVal;
      };

      const admNoVal = getValue(['admissionno', 'admno', 'scholarno', 'scholarno', 'regno', 'studentid', 'rollno']).toString().trim();
      const nameVal = getValue(['studentname', 'name', 'fullname']).toString().trim();
      const classVal = getValue(['class', 'grade', 'standard']).toString().trim();
      const amountVal = Number(getValue(['amountpaid', 'paidamount', 'amount', 'feepaid', 'feespaid', 'fee', 'totalpaid'])) || 0;
      const payModeRaw = getValue(['paymentmode', 'paymode', 'mode', 'paymenttype'], 'Cash').toString().trim();
      const receiptNoRaw = getValue(['receiptno', 'recno', 'voucherno', 'billno']).toString().trim();
      const dateRaw = getValue(['receiptdate', 'paymentdate', 'receivingdate', 'date', 'paydate']);
      const refVal = getValue(['bankreference', 'referencenumber', 'refno', 'transactionid', 'chequeno', 'cheque', 'reference', 'utrno']).toString().trim();
      const bankVal = getValue(['bankname', 'bank', 'depositbank']).toString().trim();
      const remarksVal = getValue(['remarks', 'remark', 'narration', 'notes', 'comment'], 'Bulk Excel Upload').toString().trim();

      // Validate Amount
      if (amountVal <= 0) {
        failed.push({
          row: rowIdx,
          admissionNo: admNoVal,
          studentName: nameVal,
          reason: 'Amount paid must be greater than 0.'
        });
        continue;
      }

      // Match Student
      let student = null;
      if (admNoVal) {
        student = admMap.get(admNoVal.toLowerCase());
      }
      if (!student && classVal && admNoVal) {
        student = rollMap.get(`${classVal.toLowerCase()}_${admNoVal.toLowerCase()}`);
      }
      if (!student && nameVal) {
        student = nameMap.get(nameVal.toLowerCase());
      }

      if (!student) {
        failed.push({
          row: rowIdx,
          admissionNo: admNoVal || 'N/A',
          studentName: nameVal || 'N/A',
          reason: `Student not found with Admission/Roll No "${admNoVal || nameVal}".`
        });
        continue;
      }

      // Normalize Payment Mode
      let paymentMode = 'Cash';
      const pUpper = payModeRaw.toUpperCase();
      if (pUpper.includes('CHEQUE') || pUpper.includes('CHQ')) paymentMode = 'Cheque';
      else if (pUpper.includes('ONLINE') || pUpper.includes('UPI') || pUpper.includes('GPAY') || pUpper.includes('PHONEPE') || pUpper.includes('PAYTM') || pUpper.includes('NEFT') || pUpper.includes('RTGS') || pUpper.includes('IMPS')) paymentMode = 'Online';
      else if (pUpper.includes('DD') || pUpper.includes('DRAFT')) paymentMode = 'DD';
      else if (pUpper.includes('CARD') || pUpper.includes('DEBIT') || pUpper.includes('CREDIT')) paymentMode = 'Card';
      else if (pUpper.includes('ADJUST')) paymentMode = 'Adjustment';

      // Parse Receipt Date
      let receiptDate = new Date();
      if (dateRaw) {
        if (typeof dateRaw === 'number') {
          // Excel serial date number conversion
          receiptDate = new Date(Math.round((dateRaw - 25569) * 86400 * 1000));
        } else {
          const parsed = new Date(dateRaw);
          if (!isNaN(parsed.getTime())) {
            receiptDate = parsed;
          }
        }
      }

      // Generate or use Receipt Number
      const receiptNo = receiptNoRaw || `REC${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      try {
        // Create FeeReceipt
        const receipt = await FeeReceipt.create({
          receiptNo,
          student: student._id,
          amountPaid: amountVal,
          paymentMode,
          receiptDate,
          remarks: remarksVal,
          referenceNumber: refVal,
          bankName: bankVal,
          status: 'Successful',
          chequeStatus: paymentMode === 'Cheque' ? 'Pending' : 'Cleared'
        });

        // Update StudentFeeLedger
        let ledger = await StudentFeeLedger.findOne({ student: student._id });
        if (!ledger) {
          ledger = new StudentFeeLedger({
            student: student._id,
            totalPayable: amountVal,
            totalPaid: 0,
            totalDues: amountVal,
            advanceAmount: 0
          });
        }

        ledger.totalPaid = (Number(ledger.totalPaid) || 0) + amountVal;

        if (Number(ledger.totalDues) > 0) {
          if (amountVal >= ledger.totalDues) {
            ledger.advanceAmount = (Number(ledger.advanceAmount) || 0) + (amountVal - ledger.totalDues);
            ledger.totalDues = 0;
          } else {
            ledger.totalDues -= amountVal;
          }
        } else {
          ledger.advanceAmount = (Number(ledger.advanceAmount) || 0) + amountVal;
        }

        ledger.lastPaymentDate = receiptDate;
        await ledger.save();

        successful.push({
          row: rowIdx,
          receiptNo,
          admissionNo: student.academicDetails?.admissionNumber || admNoVal,
          studentName: `${student.personalDetails?.firstName || ''} ${student.personalDetails?.lastName || ''}`.trim(),
          amountPaid: amountVal,
          paymentMode,
          date: receiptDate.toISOString().split('T')[0]
        });
      } catch (innerErr) {
        failed.push({
          row: rowIdx,
          admissionNo: admNoVal,
          studentName: nameVal,
          reason: innerErr.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Excel processed: ${successful.length} records successfully uploaded, ${failed.length} failed.`,
      stats: {
        totalRows: rawRows.length,
        successfulCount: successful.length,
        failedCount: failed.length
      },
      successful,
      failed
    });
  } catch (error) {
    console.error('Error uploading bulk fees excel:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentLedger,
  submitFeePayment,
  getAllReceipts,
  cancelFeeReceipt,
  deleteFeeReceipt,
  modifyFeeReceipt,
  manualModifyFeeReceipt,
  processRefund,
  adjustAdvance,
  updateChequeStatus,
  addManualFee,
  updateBulkReceiptMetadata,
  downloadSampleFeeExcel,
  uploadBulkFeesExcel
};

