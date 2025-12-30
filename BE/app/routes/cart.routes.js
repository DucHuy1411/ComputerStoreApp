const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", auth, cartController.getCart);
router.post("/items", auth, cartController.addItem);
router.patch("/items/:id", auth, cartController.updateItem);
router.delete("/items/:id", auth, cartController.removeItem);
router.post("/toggle-all", auth, cartController.toggleAll);
router.post("/clear", auth, cartController.clear);

module.exports = router;
