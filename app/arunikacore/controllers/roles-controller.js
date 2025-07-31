// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all roles data from database
async function getAllRoles(req, res) {
  try {
    const result = await pool.query("SELECT id, name FROM roles");
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data role",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data role tidak tersedia",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data role gagal ditampilkan",
    });
  }
}

// get specifc role data by id from database
async function getRoleById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT id, name FROM roles WHERE id=${id}`
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data role",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data role tidak tersedia",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data role gagal ditampilkan",
    });
  }
}

// store new role data to database
async function storeRole(req, res) {
  let rolesData = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO roles (name, created_at, updated_at) VALUES ('${rolesData.name}', CURRENT_TIMESTAMP, NULL);`
    );
    res.json({
      success: true,
      data: null,
      message: "Berhasil mengirim data role",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data role gagal dikirim",
    });
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
    res.json({
      success: true,
      data: null,
      message: "Berhasil memperbarui data role",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data role gagal diperbarui",
    });
  }
}

// delete role data in database by id
async function deleteRole(req, res) {
  const roleId = req.params.id;
  try {
    const result = await pool.query(`DELETE FROM roles WHERE id = ${roleId};`);
    res.json({
      success: true,
      data: null,
      message: "Berhasil menghapus data role",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data role gagal dihapus",
    });
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  storeRole,
  updateRole,
  deleteRole,
};
