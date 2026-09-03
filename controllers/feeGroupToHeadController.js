const FeeGroupToHead = require('../models/feeGroupToHeadModel');

const getMappingByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const mapping = await FeeGroupToHead.findOne({ feeGroup: groupId }).populate('mappedHeads.feeHead mappedHeads.installment');
    
    if (mapping) {
      res.json(mapping);
    } else {
      res.json(null); // No mapping exists yet
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveMapping = async (req, res) => {
  try {
    const { feeGroup, mappedHeads } = req.body;
    
    if (!feeGroup) {
      return res.status(400).json({ message: 'Fee Group is required' });
    }

    let mapping = await FeeGroupToHead.findOne({ feeGroup });

    if (mapping) {
      mapping.mappedHeads = mappedHeads;
      await mapping.save();
    } else {
      mapping = await FeeGroupToHead.create({ feeGroup, mappedHeads });
    }

    res.json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMappingByGroup, saveMapping };
