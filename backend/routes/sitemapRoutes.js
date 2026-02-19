const express = require("express");
const router = express.Router();

const sitemapController = require("../controllers/sitemapController");

router.get("/sitemap.xml", sitemapController.generateSitemap);
router.get("/robots.txt", sitemapController.generateRobots);

module.exports = router;
