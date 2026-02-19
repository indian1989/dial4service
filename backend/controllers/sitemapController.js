const Business = require("../models/Business");
const Category = require("../models/Category");
const City = require("../models/City");

/*
====================================
GENERATE SITEMAP
====================================
*/

exports.generateSitemap = async (req, res) => {
  try {
    const businesses = await Business.find({ status: "approved" });
    const categories = await Category.find();
    const cities = await City.find({ isActive: true });

    let urls = [];

    businesses.forEach(b => {
      urls.push(`<url><loc>https://dial4service.com/business/${b.slug}</loc></url>`);
    });

    categories.forEach(c => {
      urls.push(`<url><loc>https://dial4service.com/category/${c.slug}</loc></url>`);
    });

    cities.forEach(c => {
      urls.push(`<url><loc>https://dial4service.com/city/${c.slug}</loc></url>`);
    });

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("")}
      </urlset>
    `;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

