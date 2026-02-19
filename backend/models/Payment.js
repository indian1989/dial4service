const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  type: String, // featured / boost
  amount: Number,
  status: { type: String, default: "pending" },
  transactionId: String
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
