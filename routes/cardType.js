var express = require("express");
const {
  getAllCardType,
  createCardType,
  editCardType,
  deleteCardType,
} = require("../controller/cardType");

var router = express.Router();

router.get("/", getAllCardType);
router.post("/", createCardType);
router.patch("/:id", editCardType);
router.delete("/:id", deleteCardType);

module.exports = router;
