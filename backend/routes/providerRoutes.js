const router = require("express").Router();
const Provider = require("../models/Provider");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async(req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await new Provider({...req.body,password:hash}).save();
  res.json("Provider Registered");
});

router.post("/login", async(req,res)=>{
  const p = await Provider.findOne({email:req.body.email});
  const ok = await bcrypt.compare(req.body.password,p.password);
  if(!ok) return res.sendStatus(400);

  const token = jwt.sign({id:p._id,role:"provider"},process.env.JWT_SECRET);
  res.json({token});
});

module.exports = router;

const express = require("express");
const router = express.Router();
const providerAuth = require("../middleware/providerAuth");

// Provider dashboard
router.get("/dashboard", providerAuth, (req, res) => {
  res.json({
    msg: "Provider Dashboard",
    providerId: req.provider.id
  });
});

// Provider add business
router.post("/business/add", providerAuth, async (req, res) => {
  res.json({ msg: "Business added by provider" });
});

module.exports = router;
