// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// select all leave data from leaves table in database
async function getAllLeave(req, res) {
  // get userId from query url, but if userId empty set undefined for default value
  const userId = req.query.userId ? req.query.userId : undefined;

  // get startDate from query url
  const startDate = req.query.startDate;

  // get endDate from query url
  const endDate = req.query.endDate;

  try {
    // declaration query variable to contain query select leave data
    let query = "";

    // declaration values array to contain array start and end date query data
    let values = [];

    if (userId === undefined) {
      // query condition if userId empty or undefined
      query = `
        SELECT 
          leaves.id,
          leaves.user_id,
          users.name,
          leaves.start_date,
          leaves.end_date
        FROM 
          leaves
        JOIN 
          users ON leaves.user_id = users.id
        WHERE
          leaves.date BETWEEN $1 AND $2
        ORDER BY leaves.id DESC
          ;
      `;
      values = [startDate, endDate];
    } else {
      // query condition if userId not empty
      query = `
        SELECT 
          leaves.id,
          leaves.user_id,
          users.name,
          leaves.start_date,
          leaves.end_date
        FROM 
          leaves
        JOIN 
          users ON leaves.user_id = users.id
        WHERE 
          leaves.user_id = $1
        AND
          leaves.start_date BETWEEN $2 AND $3
        ORDER BY leaves.id DESC;
      `;
      values = [userId, startDate, endDate];
    }

    // write userID value and userId type for debugging in terminal
    // console.log(Number(userId));
    // console.log(typeof Number(userId));

    // save query and (start and end date) to result variable
    const result = await pool.query(query, values);

    if (result.rows.length <= 0) {
      // condition if result empty
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data cuti",
      });
    } else {
      // condition if result not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Tidak ada data cuti",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.log(err);

    // condition if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data cuti gagal diambil",
    });
  }
}

// select 1 attendance data from attendances table with 'id' from url
async function getLeaveById(req, res) {
  // get id from url parameters
  const id = req.params.id;

  try {
    // query for get attendance data with specific 'id' attendance
    const result = await pool.query(`
      SELECT
        leaves.id,
        leaves.start_date,
        leaves.end_date,
        leaves.type,
        leaves.reason,
        leaves.attachment,
        leaves.status,
        users.name AS user_name,
        positions.name AS position_name,
        companies.name AS company_name
      FROM
        leaves
      JOIN
        users ON leaves.user_id = users.id
      JOIN
        positions ON users.position_id = positions.id
      JOIN
        companies ON positions.company_id = companies.id
      WHERE
        leaves.id = ${id};
      `);

    if (result.rows.length > 0) {
      // condition if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Data cuti berhasil diambil",
      });
    } else {
      // condition if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data cuti kosong",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // condition if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data cuti gagal ditampilkan",
    });
  }
}

// update status leave
async function updateLeave(req, res) {
  // get all new data from front-end
  // (name, work_start, work_end, location_lat, location_long)
  let leaveData = req.body;

  // get role 'id' from url
  const leaveId = req.params.id;

  try {
    // query for update company data in companiess table
    const result = await pool.query(`
      UPDATE 
        leaves 
      SET 
        status = ${leaveData.status}
      WHERE 
        id = '${leaveId}'
      ;`);

    // response if update company data process is success
    res.json({
      success: true,
      data: null,
      message: "Status cuti berhasil diubah",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(500).json({
      success: false,
      message: "Status cuti gagal diubah",
    });
  }
}

module.exports = {
  getAllLeave,
  getLeaveById,
  updateLeave,
};
