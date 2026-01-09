const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");

router.get("/options", shippingController.options);

module.exports = router;
