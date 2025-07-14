const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const authenticate = require("./auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", authenticate, controller.profile);
router.get("/check", authenticate, controller.check);

module.exports = router;
