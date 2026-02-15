const router = require("express").Router();
const Business = require("../models/Business");
const auth = require("../middleware/auth");

router.post("/add", auth("provider"), async(req,res)=>{
  await new Business({...req.body,providerId:req.user.id}).save();
  res.json("Business Added (Pending)");
});

router.get("/approved", async(req,res)=>{
  const data = await Business.find({status:"approved"});
  res.json(data);
});

module.exports = router;
router.get("/search", async(req,res)=>{
  const { city, category } = req.query;
  const data = await Business.find({
    city,
    category,
    status: "approved"
  });
  res.json(data);
});
