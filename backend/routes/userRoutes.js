const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async(req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await new User({...req.body,password:hash}).save();
  res.json("User Registered");
});

router.post("/login", async(req,res)=>{
  const user = await User.findOne({email:req.body.email});
  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.sendStatus(400);

  const token = jwt.sign({id:user._id,role:"user"},process.env.JWT_SECRET);
  res.json({token});
});

module.exports = router;
