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

const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // seo friendly
  category: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String },          // optional
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  description: { type: String },
  images: [String],                // filenames or urls
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  addedBy: { type: String, enum: ["admin","provider"], default: "provider" },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Business", businessSchema);
