const express = require("express");
const router = express.Router();
const {
  getAllAbsensi,
  //   addAbsensi,
  getAbsensiById,
} = require("../controllers/absensiController");

router.get("/", getAllAbsensi);
router.get("/:id", getAbsensiById);
// router.post("/", addAbsensi);

module.exports = router;
