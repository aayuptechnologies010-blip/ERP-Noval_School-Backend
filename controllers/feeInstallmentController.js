const FeeInstallment = require('../models/feeInstallmentModel');

const getFeeInstallments = async (req, res) => {
  try {
    const installments = await FeeInstallment.find().sort({ pref: 1 });
    res.json(installments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFeeInstallment = async (req, res) => {
  try {
    const exists = await FeeInstallment.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: 'Installment Name already exists' });

    const inst = await FeeInstallment.create(req.body);
    res.status(201).json(inst);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFeeInstallment = async (req, res) => {
  try {
    const inst = await FeeInstallment.findById(req.params.id);

    if (inst) {
      Object.assign(inst, req.body);
      const updated = await inst.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Installment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeeInstallment = async (req, res) => {
  try {
    const inst = await FeeInstallment.findById(req.params.id);

    if (inst) {
      await inst.deleteOne();
      res.json({ message: 'Installment removed' });
    } else {
      res.status(404).json({ message: 'Installment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeeInstallments, createFeeInstallment, updateFeeInstallment, deleteFeeInstallment };
