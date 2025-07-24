// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all attendances data from database
async function getAllAttendances(req, res) {
  try {
    // const query = `
    //   SELECT
    //     json_agg(
    //       json_build_object(
    //         'id', a.id,
    //         'user', json_build_object(
    //           'id', u.id,
    //           'name', u.name
    //         ),
    //         'position', json_build_object(
    //           'id', p.id,
    //           'name', p.name
    //         ),
    //         'role', json_build_object(
    //           'id', r.id,
    //           'name', r.name
    //         ),
    //         'company', json_build_object(
    //           'id', c.id,
    //           'name', c.name
    //         ),
    //         'check_in_time', a.check_in_time,
    //         'check_out_time', a.check_out_time,
    //         'date', a.date
    //       )
    //     ) AS attendances
    //   FROM
    //     attendances a
    //   JOIN
    //     users u ON u.id = a.user_id
    //   JOIN
    //     positions p ON p.id = u.position_id
    //   JOIN
    //     companies c ON c.id = p.company_id
    //   JOIN
    //     roles r ON r.id = u.role_id;
    // `;

    const query = `
    SELECT 
      attendances.id,
      attendances.user_id,
      users.name,
      attendances.check_in_time,
      attendances.check_out_time,
      attendances.description_in,
      to_char(date, 'DD-MM-YYYY') as date
    FROM 
      attendances
    JOIN 
      users ON attendances.user_id = users.id;
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
      message: "Data absensi berhasil diambil",
    });
  } catch (err) {
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
    res.json({
      success: true,
      data: result.rows,
      message: "Data absensi berhasil diambil",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Data absensi gagal ditampilkan",
    });
  }
}

module.exports = {
  getAllAttendances,
  getAttendanceById,
};
