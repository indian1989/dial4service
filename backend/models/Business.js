const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },
  address: String,
  phone: String,
  email: String,
  website: String,
  gallery: [String],
  isFeatured: { type: Boolean, default: false },
  status: {
    type: String,
    default: "pending"
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

businessSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Business", businessSchema);
