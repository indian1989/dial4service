const Business = require("../models/Business");
const mongoose = require("mongoose");

/*
==================================================
UTILITY: SAFE PAGINATION
==================================================
*/
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50); // MAX 50
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};


/*
==================================================
PUBLIC - LIST WITH FILTER + PAGINATION
==================================================
*/
exports.getAllBusinesses = async (req, res) => {
  try {
    const { city, category } = req.query;
    const { page, limit, skip } = getPagination(req);

    const filter = { status: "approved" };
    if (city) filter.citySlug = city;
    if (category) filter.categorySlug = category;

    const businesses = await Business.find(filter)
      .select("name slug city category rating views images")
      .sort({ featured: -1, rating: -1, views: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: businesses
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/*
==================================================
GET SINGLE BUSINESS BY SLUG
==================================================
*/
exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({
      slug: req.params.slug,
      status: "approved"
    }).lean();

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // increment views async
    Business.updateOne({ _id: business._id }, { $inc: { views: 1 } }).exec();

    res.json(business);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/*
==================================================
SEO CITY + CATEGORY
==================================================
*/
exports.getByCityCategory = async (req, res) => {
  try {
    const { citySlug, categorySlug } = req.params;
    const { page, limit, skip } = getPagination(req);

    const filter = {
      citySlug,
      categorySlug,
      status: "approved"
    };

    const businesses = await Business.find(filter)
      .select("name slug rating views images")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: businesses
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/*
==================================================
TEXT SEARCH
==================================================
*/
exports.searchBusinesses = async (req, res) => {
  try {
    const { q } = req.query;
    const { page, limit, skip } = getPagination(req);

    if (!q) return res.status(400).json({ message: "Search query required" });

    const filter = {
      $text: { $search: q },
      status: "approved"
    };

    const businesses = await Business.find(filter, {
      score: { $meta: "textScore" }
    })
      .select("name slug rating views images")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: businesses
    });

  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
};


/*
==================================================
NEAR ME (GEO SEARCH)
==================================================
*/
exports.getNearbyBusinesses = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;
    const { page, limit, skip } = getPagination(req);

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    const businesses = await Business.find({
      status: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    })
      .select("name slug rating views images")
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      page,
      data: businesses
    });

  } catch (err) {
    res.status(500).json({ message: "Geo search error" });
  }
};


/*
==================================================
CREATE BUSINESS
==================================================
*/
exports.createBusiness = async (req, res) => {
  try {

    const business = new Business({
      ...req.body,
      ownerId: req.user.id,
      status: "pending"
    });

    await business.save();

    res.status(201).json({
      message: "Business created, pending approval",
      business
    });

  } catch (err) {
    res.status(400).json({ message: "Creation failed" });
  }
};


/*
==================================================
UPDATE BUSINESS
==================================================
*/
exports.updateBusiness = async (req, res) => {
  try {

    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Not found" });

    if (
      business.ownerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(business, req.body);
    await business.save();

    res.json({ message: "Updated successfully", business });

  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};


/*
==================================================
DELETE BUSINESS
==================================================
*/
exports.deleteBusiness = async (req, res) => {
  try {

    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Not found" });

    if (
      business.ownerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await business.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
};


/*
==================================================
ADMIN ACTIONS
==================================================
*/
exports.approveBusiness = async (req, res) => {
  await Business.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Approved" });
};

exports.rejectBusiness = async (req, res) => {
  await Business.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Rejected" });
};

exports.toggleFeatured = async (req, res) => {
  const business = await Business.findById(req.params.id);
  business.featured = !business.featured;
  await business.save();
  res.json({ message: "Feature status updated" });
};
