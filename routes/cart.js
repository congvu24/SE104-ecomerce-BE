var express = require("express");
const {
  getCartItems,
  addItemToCart,
  editItemInCart,
  deleteItemInCart,
} = require("../controller/cart");

var router = express.Router();

router.get("/", getCartItems); // get all items in cart
router.post("/", addItemToCart); //add new item to cart and create new cart if not exists
router.patch("/", editItemInCart); // modify number and variant of product in cart
router.delete("/:product_id/:variant_id", deleteItemInCart); // modify number and variant of product in cart
router.post("/checkout"); // checkout current cart;

module.exports = router;
