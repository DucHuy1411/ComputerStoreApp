const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");
const { auth } = require("../middlewares/auth.middleware");
const { admin } = require("../middlewares/admin.middleware");

// Public routes
router.get("/", productsController.index);
router.get("/:id", productsController.detail);
router.get("/:id/flash-sale", productsController.flashSaleInfo);

// Admin routes
router.post("/", auth, admin, productsController.create);
router.put("/:id", auth, admin, productsController.update);
router.delete("/:id", auth, admin, productsController.delete);
router.patch("/:id/status", auth, admin, productsController.toggleStatus);

module.exports = router;
