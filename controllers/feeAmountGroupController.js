const FeeAmountGroup = require('../models/feeAmountGroupModel');
const FeeGroupToHead = require('../models/feeGroupToHeadModel');

const getAmounts = async (req, res) => {
  try {
    const { groupId, installmentId } = req.query;
    
    if (!groupId) return res.status(400).json({ message: 'groupId required' });
    
    const query = { feeGroup: groupId };
    if (installmentId && installmentId !== 'All') {
      query.installment = installmentId;
    } else {
      query.installment = null;
    }

    const mapping = await FeeAmountGroup.findOne(query).populate('amounts.feeHead');
    
    // If not found, we should ideally fetch the mapped heads for this group to show empty inputs
    if (!mapping) {
      const groupMapping = await FeeGroupToHead.findOne({ feeGroup: groupId }).populate('mappedHeads.feeHead');
      
      if (!groupMapping || groupMapping.mappedHeads.length === 0) {
        return res.json({ amounts: [] });
      }

      // Filter heads by installment if an installment is selected
      // Normally, if mappedHeads has installment logic, we filter. For simplicity, just return all mapped heads.
      let headsToReturn = groupMapping.mappedHeads;
      if (installmentId && installmentId !== 'All') {
         headsToReturn = headsToReturn.filter(h => !h.installment || h.installment.toString() === installmentId);
      }

      const emptyAmounts = headsToReturn.filter(h => h.checked).map(h => ({
        feeHead: h.feeHead,
        amount: 0
      }));

      return res.json({ amounts: emptyAmounts });
    }

    res.json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveAmounts = async (req, res) => {
  try {
    const { feeGroup, installment, amounts } = req.body;
    
    if (!feeGroup) return res.status(400).json({ message: 'Fee Group is required' });

    const query = { feeGroup, installment: installment === 'All' ? null : installment };

    let mapping = await FeeAmountGroup.findOne(query);

    if (mapping) {
      mapping.amounts = amounts;
      await mapping.save();
    } else {
      mapping = await FeeAmountGroup.create({ feeGroup, installment: query.installment, amounts });
    }

    res.json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAmounts, saveAmounts };
