// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// function for get all postions from database
async function getAllPositions(req, res) {
  try {
    // query for select id and name data from positions table in database
    const result = await pool.query(`
    SELECT
      id, name
    FROM
      positions
    `);

    if (result.rows.length > 0) {
      // response if result variable not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil semua data posisi",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data posisi yang ditampikan",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data posisi gagal ditampilkan",
    });
  }
}

// get 1 position data with 'id' parameter
async function getPositionById(req, res) {
  // get 'id' from url and contain in id variable
  const id = req.params.id;
  try {
    // query for select id, name, company_id from positions table in database
    // select company name from companies table in database
    const result = await pool.query(`
    SELECT
      positions.id,
      positions.name,
      positions.company_id,
      companies.name AS company_name
    FROM
      positions
    JOIN
      companies ON positions.company_id = companies.id
    WHERE
      positions.id=${id};  
    `);
    if (result.rows.length > 0) {
      // response if position data found
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil data posisi",
      });
    } else {
      // response if position data not found
      res.json({
        success: true,
        data: null,
        message: "Tidak ada data posisi yang ditampikan",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data posisi gagal ditampilkan",
    });
  }
}

// insert new position data to positions table in database
async function storePosition(req, res) {
  // get all data post from front-end
  // (name and company_id)
  let positionData = req.body;

  try {
    // query for insert data name and company_id to positions table in database
    const result = await pool.query(`
      INSERT INTO 
        positions (
          name, 
          company_id, 
          created_at, 
          updated_at
        ) 
      VALUES 
        (
          '${positionData.name}', 
          ${positionData.company_id}, 
          CURRENT_TIMESTAMP, 
          NULL
        )
      ;`);

    // response if store position data process is success
    res.json({
      success: true,
      data: null,
      message: "Data posisi baru berhasil disimpan",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if insert data to positions table not run or fail
    res.status(400).json({
      success: false,
      message: "Data posisi gagal disimpan",
    });
  }
}

// update position data from positions table in database
async function updatePosition(req, res) {
  // get all new data from front-end
  // (name and company_id)
  let positionData = req.body;

  // get position id from url
  const positionId = req.params.id;

  try {
    // query for update position data in positions table
    const result = await pool.query(`
      UPDATE 
        positions 
      SET 
        name = '${positionData.name}', 
        company_id = ${positionData.company_id}, 
        updated_at=CURRENT_TIMESTAMP 
      WHERE 
        id = '${positionId}'
      ;`);

    // response if update position data process is success
    res.json({
      success: true,
      data: null,
      message: "Data posisi berhasil diperbarui",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if update data to positions table not run or fail
    res.status(400).json({
      success: false,
      message: "Data posisi gagal diperbarui",
    });
  }
}

// delete position data from positions table in database
async function deletePosition(req, res) {
  // get 'id' position from url
  const positionId = req.params.id;

  try {
    // query for delete position data
    const result = await pool.query(`
      DELETE FROM 
        positions 
      WHERE 
        id = ${positionId}
      ;`);

    // response if delete position data process is success
    res.json({
      success: true,
      data: null,
      message: "Data posisi baru berhasil dihapus",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data posisi gagal dihapus",
    });
  }
}

// export all function for use to other file or other location
module.exports = {
  getAllPositions,
  getPositionById,
  storePosition,
  updatePosition,
  deletePosition,
};
