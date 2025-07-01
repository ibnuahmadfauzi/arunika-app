const express = require("express");
const router = express.Router();

// import controllers
const arunikaController = require("../controllers/arunikacore-controllers");

// Middleware specific to this router
router.use((req, res, next) => {
  console.log("ArunikaCore Router Time:", Date.now());
  next();
});

// GET ArunikaCore "/"
router.get("/", (req, res) => {
  res.send("ArunikaCore: HomePage");
});

// Route for companies
// GET : all companies
router.get("/companies", arunikaController.getAllCompanies);
// GET : 1 company
router.get("/companies/:id", arunikaController.getCompanyById);

module.exports = router;
