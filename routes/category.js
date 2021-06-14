var express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
  uploadCategoryImage,
  getCategory,
} = require("../controller/category");
const multer = require("multer");

const adminAuth = require("../middleware/adminAuthMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});

function uploadFile(req, res, next) {
  var upload = multer({
    storage: storage,
    onError: function (err) {
      console.log("error", err);
      next({ status: false });
    },
  }).single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Error occurred!" });
    } else if (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Error occurred!" });
    }
    next();
  });
}

router.get("/", authenticateToken, adminAuth, getCategory);
router.post("/create", authenticateToken, adminAuth, createCategory);
router.patch("/:id", authenticateToken, adminAuth, editCategory);
router.delete("/delete/:id", authenticateToken, adminAuth, deleteCategory);
router.post("/image", uploadFile, uploadCategoryImage);

module.exports = router;
