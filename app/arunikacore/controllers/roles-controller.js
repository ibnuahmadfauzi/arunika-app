// import package
const pool = require("../../../config/db-pg"); // import koneksi database
require("dotenv").config();

// get all roles data from database
async function getAllRoles(req, res) {
  try {
    const result = await pool.query("SELECT * FROM roles");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// get specifc role data by id from database
async function getRoleById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM roles WHERE id=${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// store new role data to database
async function storeRole(req, res) {
  let rolesData = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO roles (name, created_at, updated_at) VALUES ('${rolesData.name}', CURRENT_TIMESTAMP, NULL);`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// update role data to database by id
async function updateRole(req, res) {
  let rolesData = req.body;
  const roleId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE roles SET name = '${rolesData.name}', updated_at=CURRENT_TIMESTAMP WHERE id = '${roleId}';`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// delete role data in database by id
async function deleteRole(req, res) {
  const roleId = req.params.id;
  try {
    const result = await pool.query(`DELETE FROM roles WHERE id = ${roleId};`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  storeRole,
  updateRole,
  deleteRole,
};
