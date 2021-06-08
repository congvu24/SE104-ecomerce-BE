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

var upload = multer({ storage: storage });

router.get("/:id", adminAuth, getProductDetail);
router.get("/", adminAuth, getProducts);

router.post("/create", adminAuth, createProduct);
router.put("/edit", adminAuth, editProduct);
router.delete("/delete/:id", adminAuth, deleteProduct);
router.post("/:id/add-variant", adminAuth, addVariant);
router.delete("/:id/delete-variant", adminAuth, deleteVariant);
router.post("/image", adminAuth, upload.single("image"), uploadProductImage);
router.delete("/image/:filename", adminAuth, deleteProductImage);

module.exports = router;
