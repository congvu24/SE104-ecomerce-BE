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

router.get("/:id", getProductDetail);
router.get("/", getProducts);

router.post("/create", authenticateToken, createProduct);
router.put("/edit", authenticateToken, editProduct);
router.delete("/delete/:id", authenticateToken, deleteProduct);
router.post("/:id/add-variant", authenticateToken, addVariant);
router.delete("/:id/delete-variant", authenticateToken, deleteVariant);
router.post(
  "/image",
  authenticateToken,
  upload.single("image"),
  uploadProductImage
);
router.delete("/image/:filename", authenticateToken, deleteProductImage);

module.exports = router;
