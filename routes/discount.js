var express = require("express");
const {
  getAllDiscount,
  createDiscount,
  editDiscount,
  deleteDiscount,
  getDiscountDetail,
} = require("../controller/dicount");

const adminAuth = require("../middleware/adminAuthMiddleware");

var router = express.Router();

router.get("/:code", getDiscountDetail);
router.get("/", adminAuth, getAllDiscount);
router.post("/", adminAuth, createDiscount);
router.patch("/:id", adminAuth, editDiscount);
router.delete("/:id", adminAuth, deleteDiscount);

module.exports = router;
