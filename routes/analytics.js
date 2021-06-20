var express = require("express");
const { getOrders, getOrderDetail, getUsers, getNumber } = require("../controller/analytics");

const adminAuth = require("../middleware/adminAuthMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
var router = express.Router();

router.get("/order-detail/:id", authenticateToken, adminAuth, getOrderDetail);
router.get("/orders", authenticateToken, adminAuth, getOrders);
router.get("/orders/:month/:year", authenticateToken, adminAuth, getOrders);
router.get("/users", authenticateToken, adminAuth, getUsers)
router.get("/number", authenticateToken, adminAuth, getNumber)

module.exports = router;
