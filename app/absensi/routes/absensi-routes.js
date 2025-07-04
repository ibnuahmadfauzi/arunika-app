const express = require("express");
const router = express.Router();

// import controller
const checkInController = require("../controllers/checkin-controllers");

// Middleware specific to this router
router.use((req, res, next) => {
  console.log("Users Router Time:", Date.now());
  next();
});

// GET absensi "/"
router.get("/", (req, res) => {
  res.send("Absensi: HomePage");
});

router.post("/checkin", checkInController.checkIn);

module.exports = router;
