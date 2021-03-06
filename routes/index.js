var express = require("express");
var router = express.Router();
var userRouter = require("./user");
var categoryRouter = require("./category");
var productRouter = require("./product");
var shopRouter = require("./shop");
var shippingRouter = require("./shippingMethod");
var cardRouter = require("./cardType");
var discountRouter = require("./discount");
var cartRouter = require("./cart");
var analyticsRouter = require("./analytics");

router.get("/", (req, res, next) => {
  res.send("hi");
});
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/shop", shopRouter);
router.use("/cart", cartRouter);
router.use("/services/shipping", shippingRouter);
router.use("/services/card", cardRouter);
router.use("/services/discount", discountRouter);
router.use("/analytics", analyticsRouter);

module.exports = router;
