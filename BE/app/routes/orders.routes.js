const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", auth, ordersController.index);
router.get("/:id", auth, ordersController.detail);
router.post("/checkout-from-cart", auth, ordersController.checkoutFromCart);
router.post("/buy-now", auth, ordersController.buyNow);
router.post("/:id/cancel", auth, ordersController.cancel);

module.exports = router;
