var express = require("express");
const { getOrders, getOrderDetail, getUsers } = require("../controller/analytics");

const adminAuth = require("../middleware/adminAuthMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.get("/order-detail/:id", authenticateToken, adminAuth, getOrderDetail);
router.get("/orders", authenticateToken, adminAuth, getOrders);
router.get("/orders/:month/:year", authenticateToken, adminAuth, getOrders);
router.get("/users", authenticateToken, adminAuth, getUsers)

module.exports = router;
