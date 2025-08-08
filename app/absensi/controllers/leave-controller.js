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
          '${newLeaveData.status}',
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

module.exports = {
  leaveAttachment,
};
