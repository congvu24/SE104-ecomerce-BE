var express = require("express");
const { getRecommendProduct, getCategory, getNewProduct, searchByName, getProductDetail, getProductOfCategory, getRelateProduct } = require("../controller/shop");

var router = express.Router();



router.get("/recommend", getRecommendProduct);
router.get("/categories", getCategory);
router.get("/new-products", getNewProduct);
router.get("/hot-products");
router.get("/search", searchByName);
router.get("/detail/:id", getProductDetail);
router.get("/category/:id/products", getProductOfCategory); // products of category
router.get("/relate-products/:id", getRelateProduct);


module.exports = router;
