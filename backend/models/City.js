const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  state: {
    type: String,
    default: ""
  },

  active: {
    type: Boolean,
    default: true
  },

  popular: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("City", citySchema);
