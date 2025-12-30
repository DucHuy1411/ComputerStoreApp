const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/favorites", auth, eventsController.favorites);
router.post("/favorites/toggle", auth, eventsController.toggleFavorite);
router.get("/recent", auth, eventsController.recent);
router.post("/recent/seen", auth, eventsController.markSeen);

module.exports = router;
