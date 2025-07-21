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
