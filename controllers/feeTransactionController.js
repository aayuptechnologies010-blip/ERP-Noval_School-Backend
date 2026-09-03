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
  updateBulkReceiptMetadata
};
