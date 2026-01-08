const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { auth } = require("../middlewares/auth.middleware");
const { admin } = require("../middlewares/admin.middleware");

// Tạm thời bỏ qua auth để test UI
// router.get("/dashboard/stats", auth, admin, adminController.dashboardStats);
router.get("/dashboard/stats", adminController.dashboardStats);

// Orders management
router.get("/orders", adminController.getOrders);
router.get("/orders/:id", adminController.getOrderDetail);
router.put("/orders/:id/status", adminController.updateOrderStatus);
router.put("/orders/:id/payment-status", adminController.updatePaymentStatus);

// Users management
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.patch("/users/:id/role", adminController.updateUserRole);
router.patch("/users/:id/status", adminController.updateUserStatus);

// Promotions management
router.get("/promotions", adminController.getPromotions);
router.get("/promotions/:id", adminController.getPromotionDetail);
router.post("/promotions", adminController.createPromotion);
router.put("/promotions/:id", adminController.updatePromotion);
router.delete("/promotions/:id", adminController.deletePromotion);
router.post("/promotions/:id/items", adminController.addPromotionItem);
router.delete("/promotions/:id/items/:itemId", adminController.removePromotionItem);

// Promotion Items management
router.get("/promotion-items", adminController.getPromotionItems);
router.put("/promotion-items/:id", adminController.updatePromotionItem);
router.delete("/promotion-items/:id", adminController.deletePromotionItem);

// Categories management
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

module.exports = router;

