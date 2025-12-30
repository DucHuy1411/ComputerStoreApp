const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", auth, notificationsController.index);
router.get("/unread-count", auth, notificationsController.unreadCount);
router.patch("/:id/read", auth, notificationsController.read);

module.exports = router;
