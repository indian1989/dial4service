const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  city: {
    type: String,
    required: true,
    index: true
  },

  citySlug: {
    type: String,
    required: true,
    index: true
  },

  category: {
    type: String,
    required: true,
    index: true
  },

  categorySlug: {
    type: String,
    required: true,
    index: true
  },

  description: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    index: true
  },

  address: {
    type: String,
    default: ""
  },

  // 🌍 GEO LOCATION (Near Me Ready)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere"
    }
  },

  // 🖼 Cloudinary Image URL
  images: [{
    type: String
  }],

  rating: {
    type: Number,
    default: 0,
    index: true
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  views: {
    type: Number,
    default: 0,
    index: true
  },

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
    index: true
  }

}, {
  timestamps: true
});


// ================= INDEXING (VERY IMPORTANT) =================

// City + Category compound index (FAST FILTERING)
businessSchema.index({ citySlug: 1, categorySlug: 1, status: 1 });

// Slug fast lookup
businessSchema.index({ slug: 1 });

// Geo index
businessSchema.index({ location: "2dsphere" });

// Text search index
businessSchema.index({
  name: "text",
  description: "text",
  address: "text"
});

module.exports = mongoose.model("Business", businessSchema);
