var express = require("express");
const multer = require("multer");

const {
  createProduct,
  editProduct,
  deleteProduct,
  addVariant,
  getProductDetail,
  deleteVariant,
  getProducts,
  uploadProductImage,
  deleteProductImage,
  editProductVariant,
  addProductImage,
} = require("../controller/product");

const authenticateToken = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");

var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/product/");
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

router.get("/:id", adminAuth, getProductDetail);
router.get("/", adminAuth, getProducts);
router.post("/create", adminAuth, createProduct);
router.patch("/:id", adminAuth, editProduct);
router.post("/:id/add-image", adminAuth, addProductImage);
router.delete("/delete/:id", adminAuth, deleteProduct);
router.post("/:id/add-variant", adminAuth, addVariant);
router.delete("/:id/delete-variant", adminAuth, deleteVariant);
router.patch("/:id/edit-variant/:variantID", adminAuth, editProductVariant);
router.post("/image", uploadFile, uploadProductImage);
router.delete("/image/:filename", adminAuth, deleteProductImage);

module.exports = router;
