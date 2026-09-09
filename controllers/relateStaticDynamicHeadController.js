const RelateStaticDynamicHead = require('../models/relateStaticDynamicHeadModel');

// @desc    Get all static-dynamic head relations
// @route   GET /api/relate-static-dynamic-heads
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const items = await RelateStaticDynamicHead.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update static-dynamic head relations
// @route   PUT /api/relate-static-dynamic-heads
// @access  Private (Admin)
const bulkUpdate = async (req, res) => {
  try {
    const { relations } = req.body;
    if (!relations || !Array.isArray(relations)) {
      return res.status(400).json({ message: 'relations array is required' });
    }

    const bulkOps = relations.map(item => ({
      updateOne: {
        filter: { staticHead: item.staticHead },
        update: {
          $set: {
            dynamicHead: item.dynamicHead || 'NA',
            selected: !!item.selected,
            highlighted: !!item.highlighted
          }
        },
        upsert: true
      }
    }));

    await RelateStaticDynamicHead.bulkWrite(bulkOps);
    const updated = await RelateStaticDynamicHead.find().sort({ createdAt: 1 });
    res.json({ message: 'Saved successfully', relations: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  bulkUpdate
};
