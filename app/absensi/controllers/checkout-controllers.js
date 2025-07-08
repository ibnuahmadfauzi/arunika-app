// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function checkOut(req, res) {
  let attendanceData = req.body;
  const attendanceId = req.params.id;

  try {
    const result = await pool.query(
      `
      UPDATE attendances
      SET 
      check_out_time = CURRENT_TIME,
      location_out_lat = '${attendanceData.location_out_lat}',
      location_out_long = '${attendanceData.location_out_long}',
      description_out = '${attendanceData.description_out}',
      photo_out = '${attendanceData.photo_out}'
      WHERE id = ${attendanceId};`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
module.exports = { checkOut };
