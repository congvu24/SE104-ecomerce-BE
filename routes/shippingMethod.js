var express = require("express");
const {
  getAllShippingMethod,
  createShippingMethod,
  editShippingMethod,
  deleteShippingMethod,
} = require("../controller/shippingMethod");

var router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");

router.get("/", getAllShippingMethod);
router.post("/", adminAuth, createShippingMethod);
router.patch("/:id", adminAuth, editShippingMethod);
router.delete("/:id", adminAuth, deleteShippingMethod);

module.exports = router;
