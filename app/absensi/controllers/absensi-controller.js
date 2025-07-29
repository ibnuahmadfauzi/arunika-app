// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function getAbsensiById(req, res) {
  // const id = req.params.id;
  const id = req.user.id;
  console.log(id);

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM attendances
        WHERE user_id = $1 AND date = CURRENT_DATE
        ORDER BY id DESC
        LIMIT 1
      `,
      [id]
    );

    if (result.rows.length > 0) {
      const status = {
        check_in_time: result.rows[0].check_in_time,
        check_out_time: result.rows[0].check_out_time,
        date: result.rows[0].date,
      };
      res.json({
        success: true,
        data: status,
        message: "Data absensi ditemukan",
      });
    } else {
      res.status(200).json({
        success: false,
        data: null,
        message: "Data absensi tidak ditemukan",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
}

async function getLastActivity(req, res) {
  const id = req.user.id;
  try {
    const result = await pool.query(
      `
    SELECT 
      TO_CHAR(date, 'DD-MM-YYYY') AS date,
      check_in_time,
      check_out_time
    FROM attendances
    WHERE user_id = $1
    ORDER BY id DESC
    LIMIT 1
  `,
      [id]
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Data absensi ditemukan",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data absensi tidak ditemukan",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Gagal mengambil aktivitas absensi",
    });
  }
}

module.exports = {
  getAbsensiById,
  getLastActivity,
};
