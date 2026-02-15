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
