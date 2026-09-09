const { FixAdvanceAccount, AdvanceEntry, AdvanceRepayment } = require('../models/advanceModel');

// ==================== 1. FIX ADVANCE ACCOUNT ====================
const getFixAdvanceAccounts = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { accountName: { $regex: search, $options: 'i' } },
        { ledgerAccountName: { $regex: search, $options: 'i' } }
      ];
    }
    const accounts = await FixAdvanceAccount.find(query).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFixAdvanceAccount = async (req, res) => {
  try {
    const { accountName, ledgerAccountId, ledgerAccountName, description, status } = req.body;
    if (!accountName) return res.status(400).json({ message: 'Account Name is required' });

    const item = await FixAdvanceAccount.create({
      accountName: accountName.trim(),
      ledgerAccountId: ledgerAccountId || '',
      ledgerAccountName: ledgerAccountName || 'General Advance Ledger',
      description: description || '',
      status: status || 'Active'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFixAdvanceAccount = async (req, res) => {
  try {
    const item = await FixAdvanceAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Account not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFixAdvanceAccount = async (req, res) => {
  try {
    const item = await FixAdvanceAccount.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 2. ADVANCE ENTRY (DISBURSEMENTS) ====================
const getAdvanceEntries = async (req, res) => {
  try {
    const { staffName, staffType, department, designation, status, fromDate, toDate, search } = req.query;
    const query = {};

    if (staffName && staffName !== 'All') query.staffName = { $regex: staffName, $options: 'i' };
    if (staffType && staffType !== 'All') query.staffType = staffType;
    if (department && department !== 'All') query.department = department;
    if (designation && designation !== 'All') query.designation = designation;
    if (status && status !== 'All') query.status = status;

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { staffName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { narration: { $regex: search, $options: 'i' } },
        { chequeNo: { $regex: search, $options: 'i' } },
        { accountName: { $regex: search, $options: 'i' } }
      ];
    }

    const entries = await AdvanceEntry.find(query).sort({ date: -1, createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAdvanceEntry = async (req, res) => {
  try {
    const {
      staffId, staffName, employeeId, designation, department, staffType,
      advanceAmount, date, recoveryMode, numberOfInstallments, monthlyInstallmentAmount,
      accountName, paymentMode, chequeNo, narration, status
    } = req.body;

    if (!staffName || !advanceAmount) {
      return res.status(400).json({ message: 'Staff Name and Advance Amount are required' });
    }

    const amt = Number(advanceAmount) || 0;
    const installments = Math.max(1, Number(numberOfInstallments) || 1);
    const monthlyAmt = Number(monthlyInstallmentAmount) || Math.round(amt / installments);

    const entry = await AdvanceEntry.create({
      staffId: staffId || null,
      staffName: staffName.trim(),
      employeeId: employeeId || '',
      designation: designation || 'Faculty',
      department: department || 'General',
      staffType: staffType || 'Teaching',
      advanceAmount: amt,
      date: date ? new Date(date) : new Date(),
      recoveryMode: recoveryMode || 'Monthly Salary Deduction',
      numberOfInstallments: installments,
      monthlyInstallmentAmount: monthlyAmt,
      accountName: accountName || 'Staff Salary Advance Ledger A/c',
      paymentMode: paymentMode || 'Bank Transfer',
      chequeNo: chequeNo || '',
      narration: narration || '',
      recoveredAmount: 0,
      leftAmount: amt,
      status: status || 'Active'
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAdvanceEntry = async (req, res) => {
  try {
    const entry = await AdvanceEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Advance Entry not found' });

    if (req.body.advanceAmount !== undefined) {
      const newAmt = Number(req.body.advanceAmount);
      req.body.leftAmount = Math.max(0, newAmt - (entry.recoveredAmount || 0));
      if (req.body.leftAmount === 0 && entry.recoveredAmount > 0) {
        req.body.status = 'Fully Recovered';
      }
    }

    const updated = await AdvanceEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAdvanceEntry = async (req, res) => {
  try {
    const entry = await AdvanceEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Advance Entry not found' });
    // Also remove associated repayments
    await AdvanceRepayment.deleteMany({ advanceEntryId: req.params.id });
    res.json({ message: 'Advance Entry and associated repayments deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 3. ADVANCE REPAYMENT ====================
const getAdvanceRepayments = async (req, res) => {
  try {
    const { staffName, fromDate, toDate, search } = req.query;
    const query = {};

    if (staffName && staffName !== 'All') query.staffName = { $regex: staffName, $options: 'i' };

    if (fromDate || toDate) {
      query.repaymentDate = {};
      if (fromDate) query.repaymentDate.$gte = new Date(fromDate);
      if (toDate) query.repaymentDate.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { staffName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { narration: { $regex: search, $options: 'i' } },
        { chequeNo: { $regex: search, $options: 'i' } },
        { accountName: { $regex: search, $options: 'i' } }
      ];
    }

    const repayments = await AdvanceRepayment.find(query).sort({ repaymentDate: -1, createdAt: -1 });
    res.json(repayments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAdvanceRepayment = async (req, res) => {
  try {
    const {
      advanceEntryId, repaymentAmount, repaymentDate, paymentMode,
      chequeNo, narration, accountName
    } = req.body;

    if (!advanceEntryId || !repaymentAmount) {
      return res.status(400).json({ message: 'Advance Entry reference and Repayment Amount are required' });
    }

    const entry = await AdvanceEntry.findById(advanceEntryId);
    if (!entry) return res.status(404).json({ message: 'Referenced Advance Entry not found' });

    const payAmt = Number(repaymentAmount);
    const prevRecovered = Number(entry.recoveredAmount) || 0;
    const newRecovered = prevRecovered + payAmt;
    const newLeft = Math.max(0, entry.advanceAmount - newRecovered);

    // Create Repayment Record
    const repayment = await AdvanceRepayment.create({
      advanceEntryId: entry._id,
      staffId: entry.staffId,
      staffName: entry.staffName,
      employeeId: entry.employeeId,
      repaymentDate: repaymentDate ? new Date(repaymentDate) : new Date(),
      repaymentAmount: payAmt,
      totalAdvance: entry.advanceAmount,
      previousRecovered: prevRecovered,
      leftAmount: newLeft,
      accountName: accountName || entry.accountName,
      paymentMode: paymentMode || 'Salary Deduction',
      chequeNo: chequeNo || '',
      narration: narration || `Repayment against advance ${entry._id.toString().slice(-4)}`,
      status: 'Approved'
    });

    // Update parent Advance Entry
    entry.recoveredAmount = newRecovered;
    entry.leftAmount = newLeft;
    if (newLeft <= 0) {
      entry.status = 'Fully Recovered';
    } else {
      entry.status = 'Partially Recovered';
    }
    await entry.save();

    res.status(201).json({ repayment, updatedEntry: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAdvanceRepayment = async (req, res) => {
  try {
    const repayment = await AdvanceRepayment.findById(req.params.id);
    if (!repayment) return res.status(404).json({ message: 'Repayment record not found' });

    // Rollback amount on parent Advance Entry
    const entry = await AdvanceEntry.findById(repayment.advanceEntryId);
    if (entry) {
      entry.recoveredAmount = Math.max(0, (entry.recoveredAmount || 0) - repayment.repaymentAmount);
      entry.leftAmount = entry.advanceAmount - entry.recoveredAmount;
      if (entry.recoveredAmount === 0) {
        entry.status = 'Active';
      } else if (entry.leftAmount > 0) {
        entry.status = 'Partially Recovered';
      }
      await entry.save();
    }

    await AdvanceRepayment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Repayment deleted and parent balance adjusted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 4. ADVANCE LEDGER STATEMENT ====================
const getAdvanceLedger = async (req, res) => {
  try {
    const { staffName, staffId, fromDate, toDate } = req.query;

    const entryQuery = {};
    const repayQuery = {};

    if (staffId) {
      entryQuery.staffId = staffId;
      repayQuery.staffId = staffId;
    } else if (staffName && staffName !== 'All') {
      entryQuery.staffName = { $regex: staffName, $options: 'i' };
      repayQuery.staffName = { $regex: staffName, $options: 'i' };
    }

    const entries = await AdvanceEntry.find(entryQuery);
    const repayments = await AdvanceRepayment.find(repayQuery);

    // Merge transactions into chronological ledger statement
    const transactions = [];

    entries.forEach(e => {
      transactions.push({
        id: e._id,
        date: e.date,
        type: 'Advance Disbursed',
        staffName: e.staffName,
        employeeId: e.employeeId,
        narration: e.narration || 'Advance disbursed to staff',
        paymentMode: e.paymentMode,
        chequeNo: e.chequeNo,
        accountName: e.accountName,
        debit: e.advanceAmount,
        credit: 0,
        sortDate: new Date(e.date).getTime()
      });
    });

    repayments.forEach(r => {
      transactions.push({
        id: r._id,
        date: r.repaymentDate,
        type: 'Advance Repayment',
        staffName: r.staffName,
        employeeId: r.employeeId,
        narration: r.narration || 'Repayment collected / salary deducted',
        paymentMode: r.paymentMode,
        chequeNo: r.chequeNo,
        accountName: r.accountName,
        debit: 0,
        credit: r.repaymentAmount,
        sortDate: new Date(r.repaymentDate).getTime()
      });
    });

    // Sort chronologically
    transactions.sort((a, b) => a.sortDate - b.sortDate);

    // Calculate running balance
    let runningBalance = 0;
    const ledger = transactions.map(t => {
      runningBalance += (t.debit - t.credit);
      return {
        ...t,
        balance: runningBalance
      };
    });

    // Filter date range if provided
    let filteredLedger = ledger;
    if (fromDate || toDate) {
      const fTime = fromDate ? new Date(fromDate).getTime() : 0;
      const tTime = toDate ? new Date(toDate).getTime() : Infinity;
      filteredLedger = ledger.filter(t => t.sortDate >= fTime && t.sortDate <= tTime);
    }

    const totalDebit = entries.reduce((s, e) => s + e.advanceAmount, 0);
    const totalCredit = repayments.reduce((s, r) => s + r.repaymentAmount, 0);
    const currentOutstanding = Math.max(0, totalDebit - totalCredit);

    res.json({
      summary: {
        totalDebit,
        totalCredit,
        currentOutstanding,
        activeAdvancesCount: entries.filter(e => e.status !== 'Fully Recovered').length,
        repaymentsCount: repayments.length
      },
      ledger: filteredLedger
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  // Fix Advance Accounts
  getFixAdvanceAccounts,
  createFixAdvanceAccount,
  updateFixAdvanceAccount,
  deleteFixAdvanceAccount,

  // Advance Entries
  getAdvanceEntries,
  createAdvanceEntry,
  updateAdvanceEntry,
  deleteAdvanceEntry,

  // Advance Repayments
  getAdvanceRepayments,
  createAdvanceRepayment,
  deleteAdvanceRepayment,

  // Advance Ledger
  getAdvanceLedger
};
