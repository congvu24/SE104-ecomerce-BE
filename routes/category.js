var express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
} = require("../controller/category");

const adminAuth = require("../middleware/adminAuthMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/create", authenticateToken, adminAuth, createCategory);
router.put("/edit", authenticateToken, adminAuth, editCategory);
router.delete("/delete/:id", authenticateToken, adminAuth, deleteCategory);

module.exports = router;
