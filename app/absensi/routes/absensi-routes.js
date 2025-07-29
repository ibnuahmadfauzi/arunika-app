const express = require("express");
const router = express.Router();

// import controller
const checkInController = require("../controllers/checkin-controllers");
const checkOutController = require("../controllers/checkout-controllers");
const absensiController = require("../controllers/absensi-controller");
const upload = require("../middleware/upload");

// Middleware specific to this router
router.use((req, res, next) => {
  console.log("Users Router Time:", Date.now());
  next();
});

// GET absensi "/"
router.get("/", (req, res) => {
  const user = req.user;
  res.json(user);
});

router.get("/status", absensiController.getAbsensiById);
router.get("/last", absensiController.getLastActivity);
router.post("/checkin", upload.single("photo_in"), checkInController.checkIn);
router.put(
  "/checkout",
  upload.single("photo_out"),
  checkOutController.checkOut
);

module.exports = router;
