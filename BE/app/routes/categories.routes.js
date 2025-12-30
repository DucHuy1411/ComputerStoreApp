const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

router.get("/", categoriesController.index);

module.exports = router;
