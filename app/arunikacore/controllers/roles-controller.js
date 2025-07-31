// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// get all roles from database
async function getAllRoles(req, res) {
  try {
    // query for select id and name from process
    const result = await pool.query(`
      SELECT 
        id, 
        name 
      FROM 
        roles  
    `);

    if (result.rows.length > 0) {
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data role",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data role tidak tersedia",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal ditampilkan",
    });
  }
}

// get 1 role data with 'id' parameter
async function getRoleById(req, res) {
  // get 'id' role from url
  const id = req.params.id;
  try {
    // query for select id and name from roles table
    const result = await pool.query(`
      SELECT 
        id, 
        name 
      FROM 
        roles 
      WHERE 
        id=${id}
      `);

    if (result.rows.length > 0) {
      // response if role data found
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data role",
      });
    } else {
      // response if role data not found
      res.json({
        success: true,
        data: null,
        message: "Data role tidak tersedia",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal ditampilkan",
    });
  }
}

// insert new role data to roles table in database
async function storeRole(req, res) {
  // get all data post from front-end
  // (name)
  let rolesData = req.body;

  try {
    // query for insert name to roles table
    const result = await pool.query(`
      INSERT INTO 
        roles 
        (
          name, 
          created_at, 
          updated_at
        ) 
      VALUES 
        (
          '${rolesData.name}', 
          CURRENT_TIMESTAMP, 
          NULL
      );`);

    // response if insert process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil mengirim data role",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal dikirim",
    });
  }
}

// update position data from positions table in database
async function updateRole(req, res) {
  // get all new data from front-end
  // (name)
  let rolesData = req.body;

  // get role 'id' from url
  const roleId = req.params.id;

  try {
    // query for update role data in roles table
    const result = await pool.query(`
      UPDATE 
        roles 
      SET 
        name = '${rolesData.name}', 
        updated_at=CURRENT_TIMESTAMP 
      WHERE 
        id = '${roleId}'
      ;`);

    // response if update process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil memperbarui data role",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal diperbarui",
    });
  }
}

// delete role data from roles table in database
async function deleteRole(req, res) {
  // get 'id' role from url
  const roleId = req.params.id;

  try {
    // query for delete role data
    const result = await pool.query(`
      DELETE FROM 
        roles 
      WHERE 
        id = ${roleId}
      ;`);

    // response if delete process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil menghapus data role",
    });
  } catch (err) {
    // write error to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal dihapus",
    });
  }
}

// export all function for use to other file or other location
module.exports = {
  getAllRoles,
  getRoleById,
  storeRole,
  updateRole,
  deleteRole,
};
