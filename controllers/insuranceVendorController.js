const InsuranceVendor = require('../models/insuranceVendorModel');

// @desc    Get all insurance vendors
// @route   GET /api/insurance-vendors
// @access  Private
const getAllVendors = async (req, res) => {
  try {
    const vendors = await InsuranceVendor.find().sort({ vendorName: 1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new insurance vendor
// @route   POST /api/insurance-vendors
// @access  Private
const createVendor = async (req, res) => {
  try {
    const { vendorName, contactPerson, phone, email, address, isActive } = req.body;
    if (!vendorName || !vendorName.trim()) {
      return res.status(400).json({ message: 'Vendor name is required' });
    }

    const existing = await InsuranceVendor.findOne({ vendorName: vendorName.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Insurance vendor already exists' });
    }

    const vendor = await InsuranceVendor.create({
      vendorName: vendorName.trim(),
      contactPerson: contactPerson || '',
      phone: phone || '',
      email: email || '',
      address: address || '',
      isActive: isActive !== false
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update insurance vendor
// @route   PUT /api/insurance-vendors/:id
// @access  Private
const updateVendor = async (req, res) => {
  try {
    const { vendorName, contactPerson, phone, email, address, isActive } = req.body;
    const vendor = await InsuranceVendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (vendorName) vendor.vendorName = vendorName.trim();
    if (contactPerson !== undefined) vendor.contactPerson = contactPerson;
    if (phone !== undefined) vendor.phone = phone;
    if (email !== undefined) vendor.email = email;
    if (address !== undefined) vendor.address = address;
    if (isActive !== undefined) vendor.isActive = isActive;

    const updated = await vendor.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete insurance vendor
// @route   DELETE /api/insurance-vendors/:id
// @access  Private
const deleteVendor = async (req, res) => {
  try {
    const vendor = await InsuranceVendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json({ message: 'Insurance vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor
};
