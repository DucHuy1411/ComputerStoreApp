const express = require("express");
const router = express.Router();
const addressesController = require("../controllers/addresses.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", auth, addressesController.index);
router.post("/", auth, addressesController.create);
router.put("/:id", auth, addressesController.update);
router.delete("/:id", auth, addressesController.remove);
router.post("/:id/set-default", auth, addressesController.setDefault);

module.exports = router;
