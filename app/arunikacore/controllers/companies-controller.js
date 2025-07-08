// import package
const pool = require("../../../config/db-pg"); // import koneksi database
require("dotenv").config();

// get all companies data from database
async function getAllCompanies(req, res) {
  try {
    const result = await pool.query("SELECT * FROM companies");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// get specifc company data by id from database
async function getCompanyById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM companies WHERE id=${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// store new company data to database
async function storeCompany(req, res) {
  let companyData = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO companies (name, created_at, updated_at) VALUES ('${companyData.name}', CURRENT_TIMESTAMP, NULL);`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// update company data to database by id
async function updateCompany(req, res) {
  let companyData = req.body;
  const companyId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE companies SET name = '${companyData.name}', updated_at=CURRENT_TIMESTAMP WHERE id = '${companyId}';`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// delete company data in database by id
async function deleteCompany(req, res) {
  const companyId = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM companies WHERE id = ${companyId};`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllCompanies,
  getCompanyById,
  storeCompany,
  updateCompany,
  deleteCompany,
};
