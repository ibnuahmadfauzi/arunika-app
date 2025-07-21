// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function checkOut(req, res) {
  const attendanceData = req.body;
  const userId = req.user.id;

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${hours}:${minutes}:${seconds}`;
  }

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return `${year}-${month}-${day}`;
  }

  try {
    // 🔍 Ambil data attendance hari ini
    const result = await pool.query(
      `
      SELECT *
      FROM attendances
      WHERE user_id = $1 AND date = CURRENT_DATE
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data attendance tidak ditemukan",
      });
    }

    const currentData = result.rows[0];

    // ✅ Ambil path file dari Multer
    const photoOutPath = req.file ? req.file.path : null;

    const newCheckOutData = {
      date: currentData.date,
      check_in_time: currentData.check_in_time,
      check_out_time: req.body.check_out_time,
      location_in_lat: currentData.location_in_lat,
      location_in_long: currentData.location_in_long,
      location_out_lat: attendanceData.location_out_lat,
      location_out_long: attendanceData.location_out_long,
      description_in: currentData.description_in,
      photo_in: currentData.photo_in,
      description_out: attendanceData.description_out,
      photo_out: photoOutPath, // ⏪ path dari Multer
    };

    await pool.query(
      `
      UPDATE attendances
      SET
        check_out_time = $1,
        location_out_lat = $2,
        location_out_long = $3,
        description_out = $4,
        photo_out = $5
      WHERE user_id = $6 AND date = $7
      `,
      [
        newCheckOutData.check_out_time,
        newCheckOutData.location_out_lat,
        newCheckOutData.location_out_long,
        newCheckOutData.description_out,
        newCheckOutData.photo_out,
        userId,
        newCheckOutData.date,
      ]
    );

    res.json({
      success: true,
      message: "Checkout berhasil",
      data: newCheckOutData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data checkout tidak valid",
    });
  }
}

module.exports = { checkOut };
