// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all attendances data from database
async function getAllAttendances(req, res) {
  try {
    const result = await pool.query(`
      SELECT id, user_id, check_in_time, check_out_time, date FROM attendances
      `);
    res.json({
      success: true,
      data: result.rows,
      message: "Data absensi berhasil diambil",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// get specifc attendance data by id from database
async function getAttendanceById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM attendances WHERE id=${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllAttendances,
  getAttendanceById,
};
