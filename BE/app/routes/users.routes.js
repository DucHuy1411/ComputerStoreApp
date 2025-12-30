const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", usersController.index); // dev/admin
router.get("/me", auth, usersController.me);
router.put("/me", auth, usersController.updateMe);
router.get("/me/stats", auth, usersController.stats);

module.exports = router;
