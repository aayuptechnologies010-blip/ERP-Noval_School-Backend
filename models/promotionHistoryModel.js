const mongoose = require('mongoose');

const promotionHistorySchema = new mongoose.Schema(
  {
    // Student who was promoted
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },

    // Previous academic details (before promotion)
    fromSession: { type: String, required: true, trim: true }, // e.g. "2025-2026"
    fromClass:   { type: String, required: true, trim: true }, // e.g. "UKG"
    fromSection: { type: String, default: '', trim: true },    // e.g. "A"
    fromRollNo:  { type: String, default: '', trim: true },

    // New academic details (after promotion)
    toSession:   { type: String, required: true, trim: true }, // e.g. "2026-2027"
    toClass:     { type: String, required: true, trim: true }, // e.g. "1"
    toSection:   { type: String, default: '', trim: true },    // e.g. "A"
    toRollNo:    { type: String, default: '', trim: true },

    // Who promoted and when
    promotedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    promotedAt: {
      type: Date,
      default: Date.now,
    },

    // Optional note
    remarks: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────

// Lookup by student
promotionHistorySchema.index({ studentId: 1, promotedAt: -1 });

// Lookup by session batch
promotionHistorySchema.index({ fromSession: 1, toSession: 1 });
promotionHistorySchema.index({ toClass: 1, toSection: 1, toSession: 1 });

// ───────────────────────────────────────────────────────────────────────────

const PromotionHistory = mongoose.model('PromotionHistory', promotionHistorySchema);

module.exports = PromotionHistory;
