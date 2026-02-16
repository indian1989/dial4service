const slugify = require("slugify");

function makeUniqueSlug(title) {
  // basic slug
  return slugify(title, { lower: true, strict: true });
}

module.exports = { makeUniqueSlug };
