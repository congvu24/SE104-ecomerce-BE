var express = require("express");
const {
  getAllCardType,
  createCardType,
  editCardType,
  deleteCardType,
} = require("../controller/cardType");

const adminAuth = require("../middleware/adminAuthMiddleware");

var router = express.Router();

router.get("/", getAllCardType);
router.post("/", adminAuth, createCardType);
router.patch("/:id", adminAuth, editCardType);
router.delete("/:id", adminAuth, deleteCardType);

module.exports = router;
