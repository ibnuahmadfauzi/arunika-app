// import package
const pool = require("../../../config/db");
require("dotenv").config();
const bcrypt = require("bcrypt");

// get all users data from database
async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// get specifc user data by id from database
async function getUserById(req, res) {
  const id = req.params.id;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// store new user data to database
async function storeUser(req, res) {
  let userData = req.body;
  const hashed = await bcrypt.hash(req.body.password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role_id, position_id, created_at, updated_at) VALUES ('${userData.name}', '${userData.email}', '${hashed}', '${userData.role_id}', '${userData.position_id}', CURRENT_TIMESTAMP, NULL);`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// update user data to database by id
async function updateUser(req, res) {
  let userData = req.body;
  const userId = req.params.id;
  const getPassword = req.body.password;

  if (getPassword.length !== "") {
    const hashed = await bcrypt.hash(req.body.password, 10);

    try {
      const result = await pool.query(
        `UPDATE users SET name = '${userData.name}', email = '${userData.email}', password = '${hashed}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  } else {
    try {
      const result = await pool.query(
        `UPDATE users SET name = '${userData.name}', email = '${userData.email}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}

// delete user data in database by id
async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = ${userId};`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser,
};
