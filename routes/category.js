var express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
} = require("../controller/category");

const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/create", authenticateToken, createCategory);
router.put("/edit", authenticateToken, editCategory);
router.delete("/delete/:id", authenticateToken, deleteCategory);

module.exports = router;
