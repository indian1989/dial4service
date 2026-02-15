const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: String,
  category: String,
  city: String,
  address: String,
  phone: String,

  providerId: mongoose.Schema.Types.ObjectId,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Business", businessSchema);
