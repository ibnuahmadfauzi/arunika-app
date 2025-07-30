// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function checkIn(req, res) {
  const photoInPath = req.file ? "/image/absensi/" + req.file.filename : null;

  const newCheckInData = {
    date: req.body.date,
    check_in_time: req.body.check_in_time,
    check_out_time: "",
    location_in_lat: req.body.location_in_lat,
    location_in_long: req.body.location_in_long,
    location_out_lat: "",
    location_out_long: "",
    description_in: req.body.description_in,
    photo_in: photoInPath,
    description_out: "",
    photo_out: "",
  };

  try {
    // Validasi field tidak undefined
    for (const [key, value] of Object.entries(newCheckInData)) {
      if (value === undefined) {
        throw new Error(`Field ${key} tidak boleh undefined`);
      }
    }

    // ✅ Cek apakah sudah ada check-in di tanggal tersebut
    const checkQuery = `
      SELECT 1 FROM attendances
      WHERE user_id = $1 AND date = CURRENT_DATE
      LIMIT 1
    `;
    const checkResult = await pool.query(checkQuery, [req.user.id]);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "User sudah melakukan check-in hari ini",
      });
    }

    // ✅ Insert jika belum ada
    await pool.query(
      `
      INSERT INTO attendances (
        user_id,
        date,
        check_in_time,
        check_out_time,
        location_in_lat,
        location_in_long,
        location_out_lat,
        location_out_long,
        description_in,
        photo_in,
        description_out,
        photo_out
      ) VALUES (
        $1, $2, $3, NULL, $4, $5, NULL, NULL, $6, $7, NULL, NULL
      )
      `,
      [
        req.user.id,
        newCheckInData.date,
        newCheckInData.check_in_time,
        newCheckInData.location_in_lat,
        newCheckInData.location_in_long,
        newCheckInData.description_in,
        newCheckInData.photo_in,
      ]
    );

    res.json({
      success: true,
      message: "Check-in berhasil",
      data: newCheckInData,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({
      success: false,
      message: err.message || "Data check-in tidak valid",
    });
  }
}

module.exports = { checkIn };
