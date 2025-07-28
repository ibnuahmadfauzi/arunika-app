// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all attendances data from database
async function getAllAttendances(req, res) {
  const userId = req.query.userId ? req.query.userId : undefined;

  try {
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
    const data = result.rows;

    // Ubah string date ke format Date JS
    const dates = data.map((item) => {
      // date format: DD-MM-YYYY → ubah ke YYYY-MM-DD supaya aman
      const [day, month, year] = item.date.split("-");
      return new Date(`${year}-${month}-${day}`);
    });

    // Ambil terkecil & terbesar
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Kalau mau dikembalikan ke string DD-MM-YYYY lagi:
    const formatDate = (d) =>
      `${String(d.getDate()).padStart(2, "0")}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${d.getFullYear()}`;

    console.log("Terkecil:", formatDate(minDate));
    console.log("Terbesar:", formatDate(maxDate));
    const startDate = req.query.startDate
      ? req.query.startDate
      : formatDate(minDate);
    const endDate = req.query.endDate ? req.query.endDate : formatDate(maxDate);
    console.log(userId + " " + startDate + " " + endDate);

    const parseDate = (str) => {
      const [day, month, year] = str.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (result.rows.length <= 0) {
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data absensi",
      });
    } else {
      if (userId === undefined) {
        const newData = data.filter((item) => {
          const itemDate = parseDate(item.date);
          return itemDate >= start && itemDate <= end;
        });
        res.json({
          success: true,
          data: newData,
          message: "Data absensi berhasil diambil",
        });
      } else {
        const filtered = data.filter((item) => item.user_id === Number(userId));
        const newData = filtered.filter((item) => {
          const itemDate = parseDate(item.date);
          return itemDate >= start && itemDate <= end;
        });

        res.json({
          success: true,
          data: newData,
          message: "Data absensi berhasil diambil",
        });
      }
    }
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
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Data absensi berhasil diambil",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data absensi kosong",
      });
    }
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
