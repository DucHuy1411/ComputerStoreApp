const express = require("express");
const router = express.Router();
const promotionsController = require("../controllers/promotions.controller");

router.get("/", promotionsController.index);
router.get("/:id/items", promotionsController.items);

module.exports = router;
