// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function checkOut(req, res) {
  const attendanceData = req.body;
  const userId = req.user.id;

  try {
    // 🔍 Ambil data attendance hari ini
    const result = await pool.query(
      `
      SELECT 
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      check_in_time,
      check_out_time,
      location_in_lat,
      location_in_long,
      location_out_lat,
      location_out_long,
      description_in,
      description_out,
      photo_in,
      photo_out
      FROM attendances
      WHERE user_id = $1 AND date = CURRENT_DATE
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Data attendance tidak ditemukan",
      });
    }

    if (result.rows[0].check_out_time !== null) {
      return res.status(200).json({
        success: false,
        message: "Sudah melakukan checkout untuk hari ini",
      });
    }

    const currentData = result.rows[0];

    // ✅ Ambil path file dari Multer
    const photoOutPath = req.file
      ? "/image/absensi/" + req.file.filename
      : null;

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
