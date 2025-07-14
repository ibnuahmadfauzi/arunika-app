// import package
const pool = require("../../../config/db");
require("dotenv").config();
// user_id: req.session.user.id,

// function to checkin attendances
async function checkIn(req, res) {
  const checkInData = req.body;

  function getCurrentTime() {
    const now = new Date();

    // Ambil jam, menit, detik
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Tambahkan leading zero jika perlu
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }

  function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    let month = now.getMonth() + 1; // getMonth() dimulai dari 0
    let day = now.getDate();

    // Tambahkan leading zero jika perlu
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${year}-${month}-${day}`;
  }

  const newCheckInData = {
    date: getCurrentDate(),
    check_in_time: getCurrentTime(),
    check_out_time: "",
    location_in_lat: req.body.location_in_lat,
    location_in_long: req.body.location_in_long,
    location_out_lat: "",
    location_out_long: "",
    description_in: req.body.description_in,
    photo_in: req.body.photo_in,
    description_out: "",
    photo_out: "",
  };

  try {
    // 👉 Validasi: cek apakah ada properti undefined
    for (const [key, value] of Object.entries(newCheckInData)) {
      if (value === undefined) {
        throw new Error(`Field ${key} tidak boleh undefined`);
      }
    }
    const result = await pool.query(
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
        ${req.user.id},
        CURRENT_DATE,
        '${newCheckInData.check_in_time}',
        NULL,
        '${newCheckInData.location_in_lat}',
        '${newCheckInData.location_in_long}',
        NULL,
        NULL,
        '${newCheckInData.description_in}',
        '${newCheckInData.photo_in}',
        NULL,
        NULL
      );
      `
    );
    res.json({
      success: true,
      message: "Checkin berhasil",
      data: newCheckInData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Data checkin tidak valid",
    });
  }
}

module.exports = { checkIn };
