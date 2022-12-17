const verifyImagePath = (req, res, next) => {
  console.log(req.imagePath);
  console.log(req.body.imagePath);

  if (typeof req.body.imagePath === "undefined")
    return res.status(400).json({ message: "imagepath is required" });

  if (req.imagePath !== req.body.imagePath)
    return res.status(400).json({ message: "invalid imagepath" });

  next();
};

module.exports = verifyImagePath;
