var express = require("express");
const {
  getCartItems,
  addItemToCart,
  editItemInCart,
  deleteItemInCart,
  checkoutCart,
} = require("../controller/cart");
const authenticateToken = require("../middleware/authMiddleware");

var router = express.Router();

router.get("/", authenticateToken, getCartItems); // get all items in cart
router.post("/", authenticateToken, addItemToCart); //add new item to cart and create new cart if not exists
router.patch("/", authenticateToken, editItemInCart); // modify number and variant of product in cart
router.delete("/:product_id/:variant_id", authenticateToken, deleteItemInCart); // modify number and variant of product in cart
router.post("/checkout", authenticateToken, checkoutCart); // checkout current cart;

module.exports = router;
