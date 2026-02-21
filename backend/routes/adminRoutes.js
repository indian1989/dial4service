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

const express = require("express");
const router = express.Router();

// Example Admin Route
router.get("/", (req, res) => {
  res.json({ message: "Admin route working ✅" });
});

// Example Admin POST
router.post("/create", (req, res) => {
  res.json({ message: "Admin created successfully " });
});

module.exports = router;

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Admin not found" });

    if (admin.password !== password)
      return res.status(401).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
