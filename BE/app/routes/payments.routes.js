const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments.controller");
const { auth } = require("../middlewares/auth.middleware");

// VNPay Payment
router.post("/vnpay/initiate", auth, paymentsController.initiateVnpayPayment);
router.get("/vnpay/return", paymentsController.vnpayReturn); // Return URL từ VNPay
router.post("/vnpay/ipn", paymentsController.vnpayIpn); // IPN webhook từ VNPay
router.get("/vnpay/status/:orderId", auth, paymentsController.checkPaymentStatus);

module.exports = router;


