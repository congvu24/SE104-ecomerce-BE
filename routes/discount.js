var express = require("express");
const {
  getAllDiscount,
  createDiscount,
  editDiscount,
  deleteDiscount,
} = require("../controller/dicount");

var router = express.Router();

router.get("/", getAllDiscount);
router.post("/", createDiscount);
router.patch("/:id", editDiscount);
router.delete("/:id", deleteDiscount);

module.exports = router;
