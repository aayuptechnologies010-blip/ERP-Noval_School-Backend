const mongoose = require('mongoose');

const reportLayoutSettingSchema = new mongoose.Schema({
  reportName: {
    type: String,
    required: [true, 'Report Name is required'],
    unique: true,
    trim: true
  },
  reportTitle: {
    type: String,
    trim: true
  },
  
  // Page Orientation & Layout Setting
  pageOrientation: { type: String, default: 'Portrait' },
  pageLayout: { type: String, default: 'A4' },
  
  // Height & Width Setting
  pageHeight: { type: Number },
  pageWidth: { type: Number },
  headerHeight: { type: Number },
  footerHeight: { type: Number },
  logoHeight: { type: Number },
  headerLineWidth: { type: Number },
  footerLineWidth: { type: Number },
  columnWidthDefault: { type: Number },
  tableColumnHeight: { type: Number },
  
  // Margin Setting
  pageMarginLeft: { type: Number },
  pageMarginRight: { type: Number },
  pageMarginTop: { type: Number },
  pageMarginBottom: { type: Number },
  logoMarginTop: { type: Number },
  logoMarginLeft: { type: Number },
  tableMarginTop: { type: Number },
  tableMarginLeft: { type: Number },
  headerLineMarginTop: { type: Number },
  footerLineMarginTop: { type: Number },
  
  // Header and Footer Setting
  isHeaderEnable: { type: Boolean, default: false },
  isHeaderLineEnable: { type: Boolean, default: false },
  isFooterEnable: { type: Boolean, default: false },
  isFooterLineEnable: { type: Boolean, default: false },
  isLogoEnable: { type: Boolean, default: false },
  isRowNo: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  isSum: { type: Boolean, default: false },
  
  // Font Size Setting
  fontSize: { type: Number },
  isTotal: { type: String, default: 'No' },
  groupPageBreak: { type: String, default: 'No' }
}, {
  timestamps: true
});

const ReportLayoutSetting = mongoose.model('ReportLayoutSetting', reportLayoutSettingSchema);

module.exports = ReportLayoutSetting;
