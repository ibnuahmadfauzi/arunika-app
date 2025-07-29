// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all attendances data from database
async function getAllAttendances(req, res) {
  const userId = req.query.userId ? req.query.userId : undefined;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    let query = "";
    let values = [];
    if (userId === undefined) {
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
      attendances.date BETWEEN $1 AND $2;
  `;
      values = [startDate, endDate];
    } else {
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
      attendances.date BETWEEN $2 AND $3;
  `;
      values = [userId, startDate, endDate];
    }

    console.log(Number(userId));
    console.log(typeof Number(userId));

    const result = await pool.query(query, values);

    if (result.rows.length <= 0) {
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data absensi",
      });
    } else {
      res.json({
        success: true,
        data: result.rows,
        message: "Tidak ada data absensi",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Data absensi gagal diambil",
    });
  }
}

// get specifc attendance data by id from database
async function getAttendanceById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(`
      SELECT
        attendances.id,
        attendances.date,
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
      res.json({
        success: true,
        data: result.rows,
        message: "Data absensi berhasil diambil",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data absensi kosong",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Data absensi gagal ditampilkan",
    });
  }
}

async function getUserLists(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name FROM users ORDER BY name ASC"
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Data nama dan id berhasil diambil",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data nama dan id tidak tersedia",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Data nama dan id gagal diambil",
    });
  }
}

module.exports = {
  getAllAttendances,
  getAttendanceById,
  getUserLists,
};
