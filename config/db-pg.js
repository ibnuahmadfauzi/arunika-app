const { Pool } = require("pg");

// Ganti dengan informasi database-mu
const pool = new Pool({
  user: process.env.ARUNIKACORE_USER, // username PostgreSQL
  host: process.env.ARUNIKACORE_HOST, // host database
  database: process.env.ARUNIKACORE_DB, // nama database
  password: process.env.ARUNIKACORE_PASS, // password database
  port: process.env.ARUNIKACORE_PORT, // default port PostgreSQL
});

module.exports = pool;
