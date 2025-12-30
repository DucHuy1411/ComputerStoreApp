const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");

router.get("/", productsController.index);
router.get("/:id", productsController.detail);
router.get("/:id/flash-sale", productsController.flashSaleInfo);

module.exports = router;
