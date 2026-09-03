const PromotionMaster = require('../models/promotionMasterModel');

// @desc    Create a new promotion master
// @route   POST /api/promotion-masters
// @access  Private
const createPromotionMaster = async (req, res) => {
  try {
    const { promotionName } = req.body;

    if (!promotionName) {
      return res.status(400).json({ message: 'Promotion name is required' });
    }

    const exists = await PromotionMaster.findOne({ promotionName: { $regex: new RegExp(`^${promotionName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Promotion already exists' });
    }

    const promotion = await PromotionMaster.create({
      promotionName
    });

    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all promotion masters
// @route   GET /api/promotion-masters
// @access  Private
const getPromotionMasters = async (req, res) => {
  try {
    const promotions = await PromotionMaster.find({}).sort({ createdAt: -1 });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get promotion master by ID
// @route   GET /api/promotion-masters/:id
// @access  Private
const getPromotionMasterById = async (req, res) => {
  try {
    const promotion = await PromotionMaster.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a promotion master
// @route   PUT /api/promotion-masters/:id
// @access  Private
const updatePromotionMaster = async (req, res) => {
  try {
    const { promotionName, isActive } = req.body;
    const promotion = await PromotionMaster.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    if (promotionName && promotionName.toLowerCase() !== promotion.promotionName.toLowerCase()) {
      const exists = await PromotionMaster.findOne({ promotionName: { $regex: new RegExp(`^${promotionName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Promotion name already in use' });
      }
    }

    if (promotionName) promotion.promotionName = promotionName;
    if (isActive !== undefined) promotion.isActive = isActive;

    const updatedPromotion = await promotion.save();
    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a promotion master
// @route   DELETE /api/promotion-masters/:id
// @access  Private
const deletePromotionMaster = async (req, res) => {
  try {
    const promotion = await PromotionMaster.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    await promotion.deleteOne();
    res.status(200).json({ message: 'Promotion removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPromotionMaster,
  getPromotionMasters,
  getPromotionMasterById,
  updatePromotionMaster,
  deletePromotionMaster
};
