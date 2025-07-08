// import package
const pool = require("../../../config/db");
require("dotenv").config();
// user_id: req.session.user.id,

// function to checkin attendances
async function checkIn(req, res) {
  const checkInData = req.body;

  try {
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
        CURRENT_TIME,
        NULL,
        '${req.body.location_in_lat}',
        '${req.body.location_in_long}',
        NULL,
        NULL,
        '${req.body.description_in}',
        '${req.body.photo_in}',
        NULL,
        NULL
      );
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

module.exports = { checkIn };
