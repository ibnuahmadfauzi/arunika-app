const cron = require("node-cron");
const pool = require("../config/db");

function startDailyJob() {
  cron.schedule("59 23 * * *", async () => {
    console.log("Menjalankan update harian...");

    try {
      const result = await pool.query(
        `
      UPDATE attendances
      SET
        check_out_time = $1,
        location_out_lat = $2,
        location_out_long = $3,
        description_out = $4,
        photo_out = $5
      WHERE check_out_time IS NULL
      `,
        ["16:00:00", "", "", "checkout by system", ""]
      );

      console.log("Update selesai:", result.rowCount);
    } catch (error) {
      console.error("Gagal update:", error);
    }
  });

  console.log("Cron job harian dijadwalkan!");
}

module.exports = startDailyJob;
