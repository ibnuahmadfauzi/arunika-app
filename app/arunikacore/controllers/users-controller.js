// import package
const pool = require("../../../config/db");
require("dotenv").config();
const bcrypt = require("bcrypt");

// get all users data from database
async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY name ASC"
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil semua data user",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data user kosong",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data user gagal ditampilkan",
    });
  }
}

// get specifc user data by id from database
async function getUserById(req, res) {
  const id = req.params.id;

  try {
    const result = await pool.query(`
    SELECT
      users.id,
      users.name,
      users.email,
      users.position_id,
      positions.name AS position_name,
      positions.company_id,
      companies.name AS company_name,
      users.role_id,
      roles.name AS role_name,
      users.photo
    FROM
      users
    JOIN
      roles ON users.role_id = roles.id
    JOIN
      positions ON users.position_id = positions.id
    JOIN
      companies ON positions.company_id = companies.id
    WHERE
      users.id = ${id};  
    `);
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data user",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data user",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data user gagal ditampilkan",
    });
  }
}

// store new user data to database
async function storeUser(req, res) {
  const photoInPath = req.file ? "/image/user/" + req.file.filename : null;
  let userData = req.body;
  const hashed = await bcrypt.hash(req.body.password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role_id, position_id, photo, created_at, updated_at) VALUES ('${userData.name}', '${userData.email}', '${hashed}', '${userData.role_id}', '${userData.position_id}', '${photoInPath}', CURRENT_TIMESTAMP, NULL);`
    );
    res.json({
      success: true,
      data: null,
      message: "Berhasil menyimpan data user",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Gagal menyimpan data user",
    });
  }
}

// update user data to database by id
async function updateUser(req, res) {
  const photoInPath = req.file ? "/image/user/" + req.file.filename : null;
  let userData = req.body;
  const userId = req.params.id;

  const getPassword = req.body.password;
  console.log(photoInPath);
  try {
    if (photoInPath !== null) {
      if (getPassword !== "") {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query(
          `UPDATE users SET name = '${userData.name}', email = '${userData.email}', password = '${hashed}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', photo = '${photoInPath}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
        );
      } else {
        const result = await pool.query(
          `UPDATE users SET name = '${userData.name}', email = '${userData.email}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', photo = '${photoInPath}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
        );
      }
    } else {
      if (getPassword !== "") {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query(
          `UPDATE users SET name = '${userData.name}', email = '${userData.email}', password = '${hashed}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
        );
      } else {
        const result = await pool.query(
          `UPDATE users SET name = '${userData.name}', email = '${userData.email}', role_id = '${userData.role_id}', position_id = '${userData.position_id}', updated_at=CURRENT_TIMESTAMP WHERE id = '${userId}';`
        );
      }
    }
    res.json({
      success: true,
      data: null,
      message: "Berhasil menyimpan data user",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Gagal menyimpan data user",
    });
  }
}

// delete user data in database by id
async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = ${userId};`);
    res.json({
      success: true,
      data: null,
      message: "Berhasil menghapus data user",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Gagal menghapus data user",
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser,
};
