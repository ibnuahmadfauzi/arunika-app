// import express package
const express = require("express");

// import ecpress router package
const router = express.Router();

// include middleware for upload image from fron-end to arunikacore app controller
const upload = require("../middleware/upload");

// import controller for (companies, positions, roles, users, and attendances table)
const companiesController = require("../controllers/companies-controller");
const positionsController = require("../controllers/positions-controller");
const rolesController = require("../controllers/roles-controller");
const usersController = require("../controllers/users-controller");
const attendancesController = require("../controllers/attendances-controller");
const leavesController = require("../controllers/leaves-controller");

// route for all endpoin to next other route
router.use((req, res, next) => {
  // write time now to terminal
  console.log("ArunikaCore Router Time:", Date.now());

  // execution to next route
  next();
});

// route for /arunikacore
router.get("/", (req, res) => {
  res.send("ArunikaCore: HomePage");
});

// ======================================================================================== //
// route for companies table and controller

// select all company data from companies table
router.get("/companies", companiesController.getAllCompanies);

// select 1 company data from companies table and user 'id' in parameter
router.get("/companies/:id", companiesController.getCompanyById);

// insert company data to companies table
router.post("/companies", companiesController.storeCompany);

// update company data in companies table
router.put("/companies/:id", companiesController.updateCompany);

// delete companies data
router.delete("/companies/:id", companiesController.deleteCompany);

// end route for companies table and controller
// ======================================================================================== //

// ======================================================================================== //
// route for positions table and controller

// select all position data from positions table
router.get("/positions", positionsController.getAllPositions);

// select 1 position data from positions table and user 'id' in parameter
router.get("/positions/:id", positionsController.getPositionById);

// insert position data to positions table
router.post("/positions", positionsController.storePosition);

// update position data in positions table
router.put("/positions/:id", positionsController.updatePosition);

// delete position data
router.delete("/positions/:id", positionsController.deletePosition);

// end route for positions table and controller
// ======================================================================================== //

// ======================================================================================== //
// route for roles table and controller

// select all role data from roles table
router.get("/roles", rolesController.getAllRoles);

// select 1 role data from roles table and role 'id' in parameter
router.get("/roles/:id", rolesController.getRoleById);

// insert role data to roles table
router.post("/roles", rolesController.storeRole);

// update role data in roles table
router.put("/roles/:id", rolesController.updateRole);

// delete role data
router.delete("/roles/:id", rolesController.deleteRole);

// end route for roles table and controller
// ======================================================================================== //

// ======================================================================================== //
// route for users table and controller

// select all user data from users table
router.get("/users", usersController.getAllUsers);

// select 1 user data from users table and user 'id' in parameter
router.get("/users/:id", usersController.getUserById);

// insert user data to users table
router.post("/users", upload.single("photo"), usersController.storeUser);

// update user data in users table
router.put("/users/:id", upload.single("photo"), usersController.updateUser);

// delete user data
router.delete("/users/:id", usersController.deleteUser);

// select all role (id & name) for use dropdown in front-end user management
router.get("/users/role/lists", usersController.getRoleLists);

// select all position (id & name) for use dropdown in front-end user management
router.get("/users/position/lists", usersController.getPositionLists);

// endroute for users table and controller
// ======================================================================================== //

// ======================================================================================== //
// route for attendances table and controller

// select all attendance data from attendances table
router.get("/attendances", attendancesController.getAllAttendances);

// select 1 attendance data from attendances table and attendance 'id' in parameter
router.get("/attendances/:id", attendancesController.getAttendanceById);

// select all user (id & name) for use dropdown in front-end user management
router.get("/attendances/user/lists", attendancesController.getUserLists);

// end route for attendances table and controller
// ======================================================================================== //

// ======================================================================================== //
// route for leaves table and controller
router.get("/leaves", leavesController.getAllLeave);

// select 1 attendance data from attendances table and attendance 'id' in parameter
router.get("/leaves/:id", leavesController.getLeaveById);

// update company data in companies table
router.put("/leaves/:id", leavesController.updateLeave);

// end route for leaves table and controller
// ======================================================================================== //

// export router file for use other file and location
module.exports = router;
