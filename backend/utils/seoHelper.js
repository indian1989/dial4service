const generateMeta = (title, description) => {
  return {
    metaTitle: title.length > 60 ? title.substring(0, 60) : title,
    metaDescription: description.length > 160
      ? description.substring(0, 160)
      : description
  };
};

module.exports = generateMeta;
