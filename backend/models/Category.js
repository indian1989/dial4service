const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  icon: { type: String },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

categorySchema.index({ name: "text" });

module.exports = mongoose.model("Category", categorySchema);
