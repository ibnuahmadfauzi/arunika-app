const express = require("express");
const router = express.Router();

// import controllers
const companiesController = require("../controllers/companies-controller");
const positionsController = require("../controllers/positions-controller");
const rolesController = require("../controllers/roles-controller");
const usersController = require("../controllers/users-controller");

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
router.get("/companies", companiesController.getAllCompanies);
// GET : 1 company
router.get("/companies/:id", companiesController.getCompanyById);
// POST : add 1 company data
router.post("/companies", companiesController.storeCompany);
// PUT : update 1 company data by ID
router.put("/companies/:id", companiesController.updateCompany);
// DELETE : delete 1 company data by ID
router.delete("/companies/:id", companiesController.deleteCompany);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for positions
// GET : all positions
router.get("/positions", positionsController.getAllPositions);
// GET : 1 position
router.get("/positions/:id", positionsController.getPositionById);
// POST : add 1 position data
router.post("/positions", positionsController.storePosition);
// PUT : update 1 position data by ID
router.put("/positions/:id", positionsController.updatePosition);
// DELETE : delete 1 position data by ID
router.delete("/positions/:id", positionsController.deletePosition);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for Users
// GET : all rules
router.get("/roles", rolesController.getAllRoles);
// GET : 1 role
router.get("/roles/:id", rolesController.getRoleById);
// POST : add 1 role data
router.post("/roles", rolesController.storeRole);
// PUT : update 1 role data by ID
router.put("/roles/:id", rolesController.updateRole);
// DELETE : delete 1 role data by ID
router.delete("/roles/:id", rolesController.deleteRole);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //
// Route for users
// GET : all users
router.get("/users", usersController.getAllUsers);
// GET : 1 user
router.get("/users/:id", usersController.getUserById);
// POST : add 1 user data
router.post("/users", usersController.storeUser);
// PUT : update 1 user data by ID
router.put("/users/:id", usersController.updateUser);
// DELETE : delete 1 user data by ID
router.delete("/users/:id", usersController.deleteUser);
// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

module.exports = router;
