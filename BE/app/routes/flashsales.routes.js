const express = require("express");
const promotionsController = require("../controllers/promotions.controller");

const router = express.Router();

// GET /api/flash-sales
router.get("/", promotionsController.flashSales);

module.exports = router;
