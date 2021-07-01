var express = require("express");
const {
  getCartItems,
  addItemToCart,
  editItemInCart,
  deleteItemInCart,
  checkoutCart,
  cancelOrder,
  changeOrderStatus,
} = require("../controller/cart");
const authenticateToken = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");

var router = express.Router();

router.get("/", authenticateToken, getCartItems); // get all items in cart
router.post("/", authenticateToken, addItemToCart); //add new item to cart and create new cart if not exists
router.patch("/", authenticateToken, editItemInCart); // modify number and variant of product in cart
router.delete("/:product_id/:variant_id", authenticateToken, deleteItemInCart); // modify number and variant of product in cart
router.post("/checkout", authenticateToken, checkoutCart); // checkout current cart;
router.patch("/cancel/:id", authenticateToken, cancelOrder);
router.patch(
  "/change-status/:id",
  authenticateToken,
  adminAuth,
  changeOrderStatus
);

module.exports = router;
