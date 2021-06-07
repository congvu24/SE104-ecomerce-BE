var express = require("express");
const {
  getAllShippingMethod,
  createShippingMethod,
  editShippingMethod,
  deleteShippingMethod,
} = require("../controller/shippingMethod");

var router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", getAllShippingMethod);
router.post("/", createShippingMethod);
router.patch("/:id", editShippingMethod);
router.delete("/:id", deleteShippingMethod);

module.exports = router;
