const FeeHeadConcession = require('../models/feeHeadConcessionModel');
const FeeHead = require('../models/feeHeadModel');

const getConcessions = async (req, res) => {
  try {
    const { concessionId, installmentId } = req.query;
    
    if (!concessionId) return res.status(400).json({ message: 'concessionId required' });
    
    const query = { concession: concessionId };
    if (installmentId && installmentId !== 'All') {
      query.installment = installmentId;
    } else {
      query.installment = null;
    }

    const mapping = await FeeHeadConcession.findOne(query).populate('concessions.feeHead');
    
    if (!mapping) {
      // Return empty inputs for all fee heads
      const allHeads = await FeeHead.find().sort({ priority: 1 });
      const emptyConcessions = allHeads.map(h => ({
        feeHead: h,
        amount: 0,
        isPercent: false,
        checked: false
      }));
      return res.json({ concessions: emptyConcessions });
    }

    // Format to include checked state
    const formatted = mapping.concessions.map(c => ({
      feeHead: c.feeHead,
      amount: c.amount,
      isPercent: c.isPercent,
      checked: true
    }));

    // We also need heads that are not mapped yet
    const allHeads = await FeeHead.find().sort({ priority: 1 });
    const fullList = allHeads.map(h => {
      const found = formatted.find(f => f.feeHead._id.toString() === h._id.toString());
      if (found) return found;
      return {
        feeHead: h,
        amount: 0,
        isPercent: false,
        checked: false
      };
    });

    res.json({ concessions: fullList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveConcessions = async (req, res) => {
  try {
    const { concession, installment, concessions } = req.body;
    
    if (!concession) return res.status(400).json({ message: 'Concession is required' });

    const query = { concession, installment: installment === 'All' ? null : installment };

    let mapping = await FeeHeadConcession.findOne(query);

    if (mapping) {
      mapping.concessions = concessions;
      await mapping.save();
    } else {
      mapping = await FeeHeadConcession.create({ concession, installment: query.installment, concessions });
    }

    res.json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConcessions, saveConcessions };
