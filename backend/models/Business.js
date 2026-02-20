const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  city: {
    type: String,
    required: true
  },

  citySlug: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  categorySlug: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  phone: {
    type: String
  },

  address: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);
