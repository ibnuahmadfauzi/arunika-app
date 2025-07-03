const express = require("express");
const router = express.Router();
const { login, profile, logout } = require("./auth-controller");

router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);

module.exports = router;
