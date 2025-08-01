// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// select all attendance data from attendances table in database
async function getAllAttendances(req, res) {
  // get userId from query url, but if userId empty set undefined for default value
  const userId = req.query.userId ? req.query.userId : undefined;

  // get startDate from query url
  const startDate = req.query.startDate;

  // get endDate from query url
  const endDate = req.query.endDate;

  try {
    // declaration query variable to contain query select attendance data
    let query = "";

    // declaration values array to contain array start and end date query data
    let values = [];

    if (userId === undefined) {
      // query condition if userId empty or undefined
      query = `
        SELECT 
          attendances.id,
          attendances.user_id,
          users.name,
          attendances.check_in_time,
          attendances.check_out_time,
          attendances.description_in,
          TO_CHAR(date, 'YYYY-MM-DD') AS date
        FROM 
          attendances
        JOIN 
          users ON attendances.user_id = users.id
        WHERE
          attendances.date BETWEEN $1 AND $2
        ORDER BY attendances.id DESC
          ;
      `;
      values = [startDate, endDate];
    } else {
      // query condition if userId not empty
      query = `
        SELECT 
          attendances.id,
          attendances.user_id,
          users.name,
          attendances.check_in_time,
          attendances.check_out_time,
          attendances.description_in,
          TO_CHAR(date, 'YYYY-MM-DD') AS date
        FROM 
          attendances
        JOIN 
          users ON attendances.user_id = users.id
        WHERE 
          attendances.user_id = $1
        AND
          attendances.date BETWEEN $2 AND $3
        ORDER BY attendances.id DESC;
      `;
      values = [userId, startDate, endDate];
    }

    // write userID value and userId type for debugging in terminal
    // console.log(Number(userId));
    // console.log(typeof Number(userId));

    // save query and (start and end date) to result variable
    const result = await pool.query(query, values);

    if (result.rows.length <= 0) {
      // condition if result empty
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data absensi",
      });
    } else {
      // condition if result not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Tidak ada data absensi",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.log(err);

    // condition if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data absensi gagal diambil",
    });
  }
}

// select 1 attendance data from attendances table with 'id' from url
async function getAttendanceById(req, res) {
  // get id from url parameters
  const id = req.params.id;

  try {
    // query for get attendance data with specific 'id' attendance
    const result = await pool.query(`
      SELECT
        attendances.id,
        TO_CHAR(attendances.date, 'YYYY-MM-DD') AS date,
        attendances.check_in_time,
        attendances.check_out_time,
        attendances.description_in,
        attendances.description_out,
        attendances.photo_in,
        attendances.photo_out,
        attendances.location_in_lat,
        attendances.location_in_long,
        attendances.location_out_lat,
        attendances.location_out_long,
        users.name AS user_name,
        positions.name AS position_name,
        companies.name AS company_name
      FROM
        attendances
      JOIN
        users ON attendances.user_id = users.id
      JOIN
        positions ON users.position_id = positions.id
      JOIN
        companies ON positions.company_id = companies.id
      WHERE
        attendances.id = ${id};
      `);

    if (result.rows.length > 0) {
      // condition if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Data absensi berhasil diambil",
      });
    } else {
      // condition if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data absensi kosong",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // condition if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data absensi gagal ditampilkan",
    });
  }
}

// select user list and use to user dropdown in attendance management front-end
async function getUserLists(req, res) {
  try {
    // query select id and name from users table
    const result = await pool.query(
      "SELECT id, name FROM users ORDER BY name ASC"
    );

    if (result.rows.length > 0) {
      // condition if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Data nama dan id berhasil diambil",
      });
    } else {
      // condition if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data nama dan id tidak tersedia",
      });
    }
  } catch (err) {
    // condition if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data nama dan id gagal diambil",
    });
  }
}

// export all function for use to other file or other location
module.exports = {
  getAllAttendances,
  getAttendanceById,
  getUserLists,
};
