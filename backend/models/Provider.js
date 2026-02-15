const mongoose = require("mongoose");

module.exports = mongoose.model("Provider",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "provider" }
  })
);
