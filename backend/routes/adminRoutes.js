const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async(req,res)=>{
  const a = await Admin.findOne({email:req.body.email});
  const ok = await bcrypt.compare(req.body.password,a.password);
  if(!ok) return res.sendStatus(400);

  const token = jwt.sign({id:a._id,role:"admin"},process.env.JWT_SECRET);
  res.json({token});
});

module.exports = router;

const Business = require("../models/Business");
const auth = require("../middleware/auth");

router.put("/approve/:id", auth("admin"), async(req,res)=>{
  await Business.findByIdAndUpdate(req.params.id,{status:"approved"});
  res.json("Approved");
});

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Business = require("../models/Business");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../utils/multer"); // multer instance
const { makeUniqueSlug } = require("../utils/slug");
const fs = require("fs");
const path = require("path");

// POST /api/admin/business/add
// fields: title, category, city, area, address, phone, email, website, description, featured, verified
// images: multipart files field name 'images' (multiple)
router.post(
  "/business/add",
  adminAuth,
  upload.array("images", 5),
  [
    body("title").notEmpty().withMessage("Title required"),
    body("category").notEmpty().withMessage("Category required"),
    body("city").notEmpty().withMessage("City required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const {
        title,
        category,
        city,
        area,
        address,
        phone,
        email,
        website,
        description,
        featured,
        verified,
        ownerId // optional: if admin adding on behalf of provider
      } = req.body;

      // create slug, ensure unique
      let slug = makeUniqueSlug(title);
      let exists = await Business.findOne({ slug });
      if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

      // process uploaded images
      let imageFiles = [];
      if (req.files && req.files.length) {
        imageFiles = req.files.map(f => f.filename);
      }

      const business = new Business({
        title,
        slug,
        category,
        city,
        area,
        address,
        phone,
        email,
        website,
        description,
        images: imageFiles,
        ownerId: ownerId || req.admin.id || null,
        addedBy: "admin",
        approved: true,             // admin adds = already approved
        featured: featured === "true" || featured === true,
        verified: verified === "true" || verified === true
      });

      await business.save();

      res.status(201).json({ msg: "Business added", business });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  }
);

module.exports = router;
