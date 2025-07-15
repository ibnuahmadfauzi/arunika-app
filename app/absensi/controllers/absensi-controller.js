// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function getAbsensiById(req, res) {
  const id = req.params.id;

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
      res.json({
        success: true,
        data: result.rows[0], // cuma 1 kan? LIMIT 1
      });
    } else {
      res.status(404).json({
        success: false,
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

module.exports = {
  getAbsensiById,
};
