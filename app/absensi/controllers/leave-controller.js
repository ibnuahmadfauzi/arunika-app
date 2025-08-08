// import package
const pool = require("../../../config/db");
require("dotenv").config();

async function leaveAttachment(req, res) {
  const photoInPath = req.file ? "/file/leave/" + req.file.filename : null;
  let newLeaveData = {
    userId: req.user.id,
    type: req.body.type,
    startDate: req.body.start_date,
    endDate: req.body.end_date,
    reason: req.body.reason,
    attachment: photoInPath,
    status: false,
  };
  try {
    const result = await pool.query(`
      INSERT INTO 
        leaves 
        (
          user_id, 
          type, 
          start_date, 
          end_date, 
          reason, 
          attachment, 
          status,
          created_at,
          updated_at
        ) 
      VALUES 
        (
          '${newLeaveData.userId}', 
          '${newLeaveData.type}', 
          '${newLeaveData.startDate}', 
          '${newLeaveData.endDate}', 
          '${newLeaveData.reason}',
          '${newLeaveData.attachment}',
            false,
            CURRENT_TIMESTAMP, 
            NULL
      );`);
    res.json({
      success: true,
      data: newLeaveData,
      message: "Data pengajuan cuti berhasil dikirim",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data cuti gagal ditambahkan",
    });
  }
}

async function leaveStatus(req, res) {
  let userId = req.user.id;
  try {
    const result = await pool.query(`
        SELECT
            type,
            start_date,
            end_date,
            reason,
            attachment,
            status
        FROM 
            leaves
        WHERE
            user_id = ${userId}
        ORDER BY 
            id DESC
        LIMIT 1;
    `);

    if (result.rows.length > 0) {
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data cuti",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data cuti kosong",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data cuti gagal ditampilkan",
    });
  }
}

module.exports = {
  leaveAttachment,
  leaveStatus,
};
