const City = require("../models/City");
const slugify = require("slugify");

/*
====================================
ADD CITY (Admin Only)
====================================
*/

exports.createCity = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCity = await City.findOne({ name });

    if (existingCity) {
      return res.status(400).json({
        message: "City already exists"
      });
    }

    const city = await City.create({
      name,
      slug: slugify(name, { lower: true })
    });

    res.status(201).json({
      success: true,
      data: city
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET ALL CITIES (Public)
====================================
*/

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET SINGLE CITY BY SLUG
====================================
*/

exports.getCityBySlug = async (req, res) => {
  try {
    const city = await City.findOne({ slug: req.params.slug });

    if (!city) {
      return res.status(404).json({
        message: "City not found"
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
UPDATE CITY (Admin Only)
====================================
*/

exports.updateCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        message: "City not found"
      });
    }

    city.name = req.body.name || city.name;
    city.slug = slugify(city.name, { lower: true });
    city.isActive = req.body.isActive ?? city.isActive;

    await city.save();

    res.status(200).json({
      success: true,
      data: city
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
DELETE CITY (Admin Only)
====================================
*/

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        message: "City not found"
      });
    }

    await city.deleteOne();

    res.status(200).json({
      success: true,
      message: "City deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
