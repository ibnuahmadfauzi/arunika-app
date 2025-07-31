// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// import bcrypt package
const bcrypt = require("bcrypt");

// function for get all users from database
async function getAllUsers(req, res) {
  try {
    // query for select id, name and email data from users table in database
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email 
      FROM 
        users 
      ORDER BY 
        name 
      ASC  
    `);

    if (result.rows.length > 0) {
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil semua data user",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data user kosong",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data user gagal ditampilkan",
    });
  }
}

// get 1 user data with 'id' parameter
async function getUserById(req, res) {
  // get 'id' user from url
  const id = req.params.id;

  try {
    // query for select data from roles table
    // (user id, user name, user email, user role_id, user position_id, and user photo)
    // (position name and position company_id)
    // (company name)
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
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data user",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data user",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data user gagal ditampilkan",
    });
  }
}

// insert new user data to users table in database
async function storeUser(req, res) {
  // create file name for upload to photo field in users table
  const photoInPath = req.file ? "/image/user/" + req.file.filename : null;

  // get all user data from front-end
  // (name, email, password, rolde_id, position_id, and photo)
  let userData = req.body;

  // create password hash with bcrypt package for write to password field in users table
  const hashed = await bcrypt.hash(req.body.password, 10);

  try {
    // query for insert user data to users table
    const result = await pool.query(`
      INSERT INTO 
        users 
        (
          name, 
          email, 
          password, 
          role_id, 
          position_id, 
          photo, 
          created_at, 
          updated_at
        ) 
      VALUES 
        (
          '${userData.name}', 
          '${userData.email}', 
          '${hashed}', 
          '${userData.role_id}', 
          '${userData.position_id}', 
          '${photoInPath}', 
          CURRENT_TIMESTAMP, 
          NULL
      );`);

    // response if insert process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil menyimpan data user",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Gagal menyimpan data user",
    });
  }
}

// update user data from users table in database
async function updateUser(req, res) {
  // create file name for upload to photo field in users table
  const photoInPath = req.file ? "/image/user/" + req.file.filename : null;

  // get all user data from front-end
  // (name, email, password, rolde_id, position_id, and photo)
  let userData = req.body;

  // get 'id' user from url
  const userId = req.params.id;

  // get password from user data in front-end
  const getPassword = req.body.password;

  // write photo location to terminal
  // console.log(photoInPath);

  try {
    // condition if photoInPath variable not 'null'
    // or front-end send image file to server
    if (photoInPath !== null) {
      // condition if password field not empty
      if (getPassword !== "") {
        // create password hash with bcrypt package for save to password field
        const hashed = await bcrypt.hash(req.body.password, 10);

        // query for update user data with photo file and new password
        const result = await pool.query(`
          UPDATE 
            users 
          SET 
            name = '${userData.name}', 
            email = '${userData.email}', 
            password = '${hashed}', 
            role_id = '${userData.role_id}', 
            position_id = '${userData.position_id}', 
            photo = '${photoInPath}', 
            updated_at=CURRENT_TIMESTAMP 
          WHERE 
            id = '${userId}'
        ;`);
      } else {
        // condition if password field empty
        // query for update user data with photo but not new password
        const result = await pool.query(`
          UPDATE 
            users 
          SET 
            name = '${userData.name}', 
            email = '${userData.email}', 
            role_id = '${userData.role_id}', 
            position_id = '${userData.position_id}', 
            photo = '${photoInPath}', 
            updated_at=CURRENT_TIMESTAMP 
          WHERE 
            id = '${userId}'
          ;`);
      }
    } else {
      // condition if password field not empty but photo file null
      if (getPassword !== "") {
        // create password hash with bcrypt package for save to password field
        const hashed = await bcrypt.hash(req.body.password, 10);

        // query for update user data with new password but not new photo file
        const result = await pool.query(`
          UPDATE 
            users 
          SET 
            name = '${userData.name}', 
            email = '${userData.email}', 
            password = '${hashed}', 
            role_id = '${userData.role_id}', 
            position_id = '${userData.position_id}', 
            updated_at=CURRENT_TIMESTAMP 
          WHERE 
            id = '${userId}'
          ;`);
      } else {
        // query for update user data but no new password and no new photo
        const result = await pool.query(`
          UPDATE 
            users 
          SET 
            name = '${userData.name}', 
            email = '${userData.email}', 
            role_id = '${userData.role_id}', 
            position_id = '${userData.position_id}', 
            updated_at=CURRENT_TIMESTAMP 
          WHERE id = '${userId}'
        ;`);
      }
    }

    // response if update user data process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil menyimpan data user",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Gagal menyimpan data user",
    });
  }
}

// delete user data from users table in database
async function deleteUser(req, res) {
  // get 'id' user from url
  const userId = req.params.id;

  try {
    // query for delete user data
    const result = await pool.query(`
      DELETE FROM 
        users 
      WHERE 
        id = ${userId};
      `);

    // response if delete process is success
    res.json({
      success: true,
      data: null,
      message: "Berhasil menghapus data user",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Gagal menghapus data user",
    });
  }
}

// export all function for use to other file or other location
module.exports = {
  getAllUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser,
};
