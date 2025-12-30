const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/trends", searchController.trends);
router.get("/recent", auth, searchController.recent);
router.post("/recent", auth, searchController.addRecent);
router.delete("/recent/:id", auth, searchController.removeRecent);
router.post("/recent/clear", auth, searchController.clearRecent);

module.exports = router;
