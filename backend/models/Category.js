const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  slug: String,
  popular: Boolean
});

module.exports = mongoose.model("Category", categorySchema);
