const Review = require("../models/Review");
const Business = require("../models/Business");

/*
====================================
ADD REVIEW (User Only)
====================================
*/

exports.addReview = async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      business: businessId,
      rating,
      comment
    });

    // Update average rating
    const reviews = await Review.find({ business: businessId });
    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await Business.findByIdAndUpdate(businessId, {
      rating: avg.toFixed(1)
    });

    res.status(201).json({ success: true, data: review });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
====================================
GET REVIEWS BY BUSINESS
====================================
*/

exports.getReviewsByBusiness = async (req, res) => {
  try {
    const reviews = await Review.find({
      business: req.params.businessId
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

