const express = require("express");
const schemas = require("./schemas/schemas");
const middleware = require("./middleware/joi.middleware");
const path = require("path");

const sharp = require("sharp");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const multer = require("multer");
const verifyJWT = require("./middleware/verifyJWT.middleware");
const verifyImage = require("./middleware/verifyImage.middleware");
const storage = multer.diskStorage({
  destination: async function (req, files, cb) {
    cb(null, "./images");
  },
  filename: function (req, files, cb) {
    cb(
      null,
      files.fieldname + "-" + Date.now() + path.extname(files.originalname)
    );
  },
});

function checkImageType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|JPG"/;
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    return cb(null, true);
  }
  return cb(new Error("Error: JPG files Only!"), false);
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    checkImageType(file, cb);
  },
});

// const resizeImages = async (req, res, next) => {
//   if (!req.files) return next();

//   req.body.main_image = "";
//   req.body.additional_images = [];

//   const newFilename = req.files.main_image.filename;
//   await sharp(req.files.main_image.)
//     .toFormat("jpeg")
//     .jpeg({ quality: 75 })
//     .toFile(`images/${newFilename}`);

//   req.body.main_image = newFilename;

//   // await Promise.all(
//   //   req.files.map(async file => {
//   //     const newFilename = '';

//   //     await sharp(file.buffer)
//   //       .resize(640, 320)
//   //       .toFormat("jpeg")
//   //       .jpeg({ quality: 90 })
//   //       .toFile(`upload/${newFilename}`);

//   //     req.body.images.push(newFilename);
//   //   })
//   // );

//   next();
// };

const uploadImages = upload.fields([
  {
    name: "main_image",
  },
  {
    name: "additional_images",
    maxCount: 5,
  },
]);

function uploadMiddleware(req, res, next) {
  uploadImages(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("A Multer error occurred when uploading.");
      return res.status(400).json(err.message);
    }

    if (typeof req.files.main_image === "undefined") {
      return res.status(400).json("main_image is required");
    } else {
      req.body.main_image = req.files.main_image[0].path.replace("\\", "/");
    }

    if (typeof req.files.additional_images !== "undefined") {
      req.body.additional_images = [];
      req.files.additional_images.map((image) => {
        req.body.additional_images.push(image.path.replace("\\", "/"));
      });
    }
    // Everything went fine.
    next();
  });
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "_")
    .replace(/[^\w-]+/g, "");
}

/* APIs */

/* /post api to add new post to blogs.json */
app.post(
  "/post",
  uploadMiddleware,
  // resizeImages,
  middleware(schemas.blogPOST),
  (req, res) => {
    var data = fs.readFileSync("blogs.json"); //read data from file blogs.json
    var myObject = JSON.parse(data);
    const reference = Number(myObject.at(-1).reference) + 1; //ncrement referece
    req.body.date_time = +req.body.date_time;
    const postData = {
      reference: "0000" + reference,
      ...req.body,
    };
    myObject.push(postData);
    var newData = JSON.stringify(myObject);
    fs.writeFileSync("blogs.json", newData, (err) => {
      //write newly added post to blogs.json
      // error checking
      if (err) throw err;
      console.log("data added succesfully");
    });
    res.status(200).json({
      data: postData,
    });
  }
);

/* API for getting all posts*/
app.get("/posts", (req, res) => {
  let data = fs.readFileSync("blogs.json");
  var myObject = JSON.parse(data);
  let result = [];
  myObject.map((post) => {
    const { date_time, title } = post;
    post.date_time = new Date(date_time).toISOString();
    post.title = convertToSlug(title);
    let data = { ...post };
    result.push(data);
  });
  res.status(200).json(result);
});

/* API for creating access token for image with image path as body*/
app.post("/image", (req, res) => {
  const { imagePath } = req.body;
  if (!imagePath)
    //if no body
    res.status(400).json({
      message: "imagePath is required",
    });

  const accessToken = jwt.sign(
    {
      image_path: imagePath,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  res.status(200).json({ accessToken: accessToken });
});

/* API for getting an image with path and access token */
app.use("/images", verifyJWT, verifyImage, express.static("images"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
