var express = require("express");
var router = express.Router();
var userRouter = require("./user");
var categoryRouter = require("./category");
var productRouter = require("./product");
var shopRouter = require("./shop");

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/shop", shopRouter);

module.exports = router;
