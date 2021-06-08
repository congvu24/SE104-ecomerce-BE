var express = require("express");
const {
  createUser,
  login,
  getProfile,
  addAddress,
  deleteAddress,
  removeCard,
  getAllCard,
  addCard,
  getAllOrder,
} = require("../controller/user");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/login", login);
router.post("/register", createUser);
router.get("/profile", authenticateToken, getProfile);
router.post("/add-address", authenticateToken, addAddress);
router.delete("/delete-address/:id", authenticateToken, deleteAddress);
router.get("/orders", authenticateToken, getAllOrder); // get order history of user

router.post("/card", authenticateToken, addCard);
router.get("/card", authenticateToken, getAllCard);
router.delete("/card/:id", authenticateToken, removeCard);

module.exports = router;
