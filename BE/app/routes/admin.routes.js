const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { auth } = require("../middlewares/auth.middleware");
const { admin } = require("../middlewares/admin.middleware");

router.get("/dashboard/stats", auth, admin, adminController.dashboardStats);

// Orders management
router.get("/orders", auth, admin, adminController.getOrders);
router.get("/orders/:id", auth, admin, adminController.getOrderDetail);
router.put("/orders/:id/status", auth, admin, adminController.updateOrderStatus);
router.put("/orders/:id/payment-status", auth, admin, adminController.updatePaymentStatus);

// Users management
router.get("/users", auth, admin, adminController.getUsers);
router.post("/users", auth, admin, adminController.createUser);
router.put("/users/:id", auth, admin, adminController.updateUser);
router.delete("/users/:id", auth, admin, adminController.deleteUser);
router.patch("/users/:id/role", auth, admin, adminController.updateUserRole);
router.patch("/users/:id/status", auth, admin, adminController.updateUserStatus);

// Promotions management
router.get("/promotions", auth, admin, adminController.getPromotions);
router.get("/promotions/:id", auth, admin, adminController.getPromotionDetail);
router.post("/promotions", auth, admin, adminController.createPromotion);
router.put("/promotions/:id", auth, admin, adminController.updatePromotion);
router.delete("/promotions/:id", auth, admin, adminController.deletePromotion);
router.post("/promotions/:id/items", auth, admin, adminController.addPromotionItem);
router.delete("/promotions/:id/items/:itemId", auth, admin, adminController.removePromotionItem);

// Promotion Items management
router.get("/promotion-items", auth, admin, adminController.getPromotionItems);
router.put("/promotion-items/:id", auth, admin, adminController.updatePromotionItem);
router.delete("/promotion-items/:id", auth, admin, adminController.deletePromotionItem);

// Categories management
router.get("/categories", auth, admin, adminController.getCategories);
router.post("/categories", auth, admin, adminController.createCategory);
router.put("/categories/:id", auth, admin, adminController.updateCategory);
router.delete("/categories/:id", auth, admin, adminController.deleteCategory);

// Shipping methods management
router.get("/shipping-methods", auth, admin, adminController.getShippingMethods);
router.post("/shipping-methods", auth, admin, adminController.createShippingMethod);
router.put("/shipping-methods/:id", auth, admin, adminController.updateShippingMethod);
router.patch("/shipping-methods/:id/toggle", auth, admin, adminController.toggleShippingMethod);
router.patch("/shipping-methods/reorder", auth, admin, adminController.reorderShippingMethods);
router.delete("/shipping-methods/:id", auth, admin, adminController.deleteShippingMethod);

module.exports = router;
