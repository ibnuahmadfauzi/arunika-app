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

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for companies
// GET : all companies
router.get("/companies", arunikaController.getAllCompanies);
// GET : 1 company
router.get("/companies/:id", arunikaController.getCompanyById);
// POST : add 1 company data
router.post("/companies", arunikaController.storeCompany);
// PUT : update 1 company data by ID
router.put("/companies/:id", arunikaController.updateCompany);
// DELETE : delete 1 company data by ID
router.delete("/companies/:id", arunikaController.deleteCompany);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for positions
// GET : all positions
router.get("/positions", arunikaController.getAllPositions);
// GET : 1 position
router.get("/positions/:id", arunikaController.getPositionById);
// POST : add 1 position data
router.post("/positions", arunikaController.storePosition);
// PUT : update 1 position data by ID
router.put("/positions/:id", arunikaController.updatePosition);
// DELETE : delete 1 position data by ID
router.delete("/positions/:id", arunikaController.deletePosition);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for Users
// GET : all rules
router.get("/rules", arunikaController.getAllRules);
// GET : 1 rule
router.get("/rules/:id", arunikaController.getRuleById);
// POST : add 1 rule data
router.post("/rules", arunikaController.storeRule);
// PUT : update 1 rule data by ID
router.put("/rules/:id", arunikaController.updateRule);
// DELETE : delete 1 rule data by ID
router.delete("/rules/:id", arunikaController.deleteRule);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for users
// GET : all users
router.get("/users", arunikaController.getAllUsers);
// GET : 1 user
router.get("/users/:id", arunikaController.getUserById);
// POST : add 1 user data
router.post("/users", arunikaController.storeUser);
// PUT : update 1 user data by ID
router.put("/users/:id", arunikaController.updateUser);
// DELETE : delete 1 user data by ID
router.delete("/users/:id", arunikaController.deleteUser);

module.exports = router;
