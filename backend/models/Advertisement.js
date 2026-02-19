const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  title: String,
  bannerUrl: String,
  link: String,
  ownerType: { type: String }, // user or provider
  ownerId: { type: mongoose.Schema.Types.ObjectId },
  isActive: { type: Boolean, default: true },
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Advertisement", advertisementSchema);
