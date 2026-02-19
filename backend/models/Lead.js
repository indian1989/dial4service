const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    lowercase: true
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new"
  },

  isPaidLead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

/*
 Indexing for fast provider dashboard filtering
*/
leadSchema.index({ provider: 1, status: 1 });
leadSchema.index({ business: 1 });

module.exports = mongoose.model("Lead", leadSchema);
