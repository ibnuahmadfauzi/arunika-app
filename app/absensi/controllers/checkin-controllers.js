// import package
const { MongoClient } = require("mongodb");
require("dotenv").config();

// create url and namedb variable
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;

// function to checkin absensi
async function checkIn(req, res) {
  res.send("Tes");
}

module.exports = { checkIn };
