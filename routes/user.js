var express = require("express");
const {
  createUser,
  login,
  getProfile,
  addAddress,
  deleteAddress,
} = require("../controller/user");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/login", login);
router.post("/register", createUser);
// router.put("/edit", createUser);
// router.post("/change-password", createUser);
router.get("/profile", authenticateToken, getProfile);
// router.get("/shoping-history", createUser);
router.post("/add-address", authenticateToken, addAddress);
router.delete("/delete-address/:id", authenticateToken, deleteAddress);
router.get("/orders") // get order history of user

module.exports = router;
