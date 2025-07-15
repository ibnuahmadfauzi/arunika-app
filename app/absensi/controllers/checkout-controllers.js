// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function checkOut(req, res) {
  let attendanceData = req.body;
  const userId = req.params.id;

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

  const result = await pool.query(
    `
      SELECT *
      FROM attendances
      WHERE user_id = $1 AND date = CURRENT_DATE
      `,
    [userId]
  );

  const currentData = result.rows[0];

  const newCheckOutData = {
    date: getCurrentDate(),
    check_in_time: currentData.check_in_time,
    check_out_time: getCurrentTime(),
    location_in_lat: currentData.location_in_lat,
    location_in_long: currentData.location_in_long,
    location_out_lat: attendanceData.location_out_lat,
    location_out_long: attendanceData.location_out_long,
    description_in: currentData.description_in,
    photo_in: currentData.photo_in,
    description_out: attendanceData.description_out,
    photo_out: attendanceData.photo_out,
  };

  try {
    const result = await pool.query(
      `
      UPDATE attendances
      SET
      check_out_time = '${newCheckOutData.check_out_time}',
      location_out_lat = '${attendanceData.location_out_lat}',
      location_out_long = '${attendanceData.location_out_long}',
      description_out = '${attendanceData.description_out}',
      photo_out = '${attendanceData.photo_out}'
      WHERE user_id = ${userId} AND date= '${newCheckOutData.date}';`
    );
    res.json({
      success: true,
      message: "Checkin berhasil",
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
