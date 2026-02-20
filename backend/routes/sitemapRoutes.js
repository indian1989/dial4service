const express = require("express");
const router = express.Router();
const { SitemapStream, streamToPromise } = require("sitemap");
const Business = require("../models/Business");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: "https://dial4service.in" });

    // Static pages
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/all-business.html", changefreq: "daily", priority: 0.9 });
    smStream.write({ url: "/add-business.html", changefreq: "weekly", priority: 0.8 });

    // Dynamic business pages
    const businesses = await Business.find({ status: "approved" });

    businesses.forEach((business) => {
      smStream.write({
        url: `/business/${business.slug}`,
        changefreq: "daily",
        priority: 0.7,
      });
    });

    smStream.end();

    const sitemapOutput = await streamToPromise(smStream);

    res.header("Content-Type", "application/xml");
    res.send(sitemapOutput.toString());
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
