const express = require("express");
const router = express.Router();

// Middleware specific to this router
router.use((req, res, next) => {
  console.log("Users Router Time:", Date.now());
  next();
});

// GET absensi "/"
router.get("/", (req, res) => {
  res.send("Absensi: HomePage");
});

module.exports = router;
