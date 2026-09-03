const FeeHead = require('../models/feeHeadModel');

const getFeeHeads = async (req, res) => {
  try {
    const feeHeads = await FeeHead.find().sort({ priority: 1 });
    res.json(feeHeads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFeeHead = async (req, res) => {
  try {
    const { name, printName, type, priority, category, ledger, tallyLedger, showInCertificate, refundable } = req.body;
    
    const exists = await FeeHead.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Fee Head already exists' });
    }

    const feeHead = await FeeHead.create({
      name, printName, type, priority, category, ledger, tallyLedger, showInCertificate, refundable
    });
    res.status(201).json(feeHead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFeeHead = async (req, res) => {
  try {
    const feeHead = await FeeHead.findById(req.params.id);

    if (feeHead) {
      feeHead.name = req.body.name || feeHead.name;
      feeHead.printName = req.body.printName || feeHead.printName;
      feeHead.type = req.body.type || feeHead.type;
      feeHead.priority = req.body.priority || feeHead.priority;
      feeHead.category = req.body.category || feeHead.category;
      feeHead.ledger = req.body.ledger || feeHead.ledger;
      feeHead.tallyLedger = req.body.tallyLedger || feeHead.tallyLedger;
      feeHead.showInCertificate = req.body.showInCertificate || feeHead.showInCertificate;
      feeHead.refundable = req.body.refundable || feeHead.refundable;

      const updated = await feeHead.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Fee Head not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeeHead = async (req, res) => {
  try {
    const feeHead = await FeeHead.findById(req.params.id);

    if (feeHead) {
      await feeHead.deleteOne();
      res.json({ message: 'Fee Head removed' });
    } else {
      res.status(404).json({ message: 'Fee Head not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeeHeads, createFeeHead, updateFeeHead, deleteFeeHead };
