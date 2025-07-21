// import package
const pool = require("../../../config/db");
require("dotenv").config();

// function to checkin attendances
async function checkIn(req, res) {
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

  // ✅ Gunakan req.file.path kalau ada file
  const photoInPath = req.file ? req.file.path : null;

  const newCheckInData = {
    date: req.body.date,
    check_in_time: req.body.check_in_time,
    check_out_time: "",
    location_in_lat: req.body.location_in_lat,
    location_in_long: req.body.location_in_long,
    location_out_lat: "",
    location_out_long: "",
    description_in: req.body.description_in,
    photo_in: photoInPath, // ⏪ Ganti pakai path file dari Multer
    description_out: "",
    photo_out: "",
  };

  try {
    // Validasi
    for (const [key, value] of Object.entries(newCheckInData)) {
      if (value === undefined) {
        throw new Error(`Field ${key} tidak boleh undefined`);
      }
    }

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
        $1, CURRENT_DATE, $2, NULL, $3, $4, NULL, NULL, $5, $6, NULL, NULL
      )
      `,
      [
        req.user.id,
        newCheckInData.check_in_time,
        newCheckInData.location_in_lat,
        newCheckInData.location_in_long,
        newCheckInData.description_in,
        newCheckInData.photo_in,
      ]
    );

    res.json({
      success: true,
      message: "Checkin berhasil",
      data: newCheckInData,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Data checkin tidak valid",
    });
  }
}

module.exports = { checkIn };
