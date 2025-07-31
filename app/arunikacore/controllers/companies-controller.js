// include DB connection
const pool = require("../../../config/db");

// import dotenv package
require("dotenv").config();

// get all roles from database
async function getAllCompanies(req, res) {
  try {
    // query for select id and name from process
    const result = await pool.query(`
      SELECT 
        id, 
        name 
      FROM 
        companies  
    `);

    if (result.rows.length > 0) {
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil semua data perusahaan",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "Data perusahaan kosong",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data perusahaan gagal ditampilkan",
    });
  }
}

// get 1 company data with 'id' parameter
async function getCompanyById(req, res) {
  // get 'id' company from url
  const id = req.params.id;

  try {
    // query for select id, name, work_start, work_end, location_lat, and location_long from companies table
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        work_start, 
        work_end, 
        location_lat, 
        location_long 
      FROM 
        companies 
      WHERE 
        id=${id}
      `);

    if (result.rows.length > 0) {
      // response if result variable is not empty
      res.json({
        success: true,
        data: result.rows,
        message: "Data perusahaan berhasil diambil",
      });
    } else {
      // response if result variable is empty
      res.json({
        success: true,
        data: null,
        message: "ID perusahaan tidak ditemukan",
      });
    }
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data role gagal ditampilkan",
    });
  }
}

// insert new company data to companies table in database
async function storeCompany(req, res) {
  // get all data post from front-end
  // (name, work_start, work_end, location_lat, location_long)
  let companyData = req.body;

  try {
    // query for insert name to companies table
    const result = await pool.query(`
      INSERT INTO 
        companies 
        (
          name, 
          created_at, 
          updated_at, 
          work_start, 
          work_end, 
          location_lat, 
          location_long
        ) 
      VALUES 
        (
          '${companyData.name}', 
          CURRENT_TIMESTAMP, 
          NULL, 
          '${companyData.work_start}', 
          '${companyData.work_end}', 
          '${companyData.location_lat}', 
          '${companyData.location_long}'
      );`);

    // response if insert process is success
    res.json({
      success: true,
      data: null,
      message: "Data perusahaan berhasil ditambahkan",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(400).json({
      success: false,
      message: "Data perusahaan gagal ditambahkan",
    });
  }
}

// update company data from companies table in database
async function updateCompany(req, res) {
  // get all new data from front-end
  // (name, work_start, work_end, location_lat, location_long)
  let companyData = req.body;

  // get role 'id' from url
  const companyId = req.params.id;

  try {
    // query for update company data in companiess table
    const result = await pool.query(`
      UPDATE 
        companies 
      SET 
        name = '${companyData.name}', 
        work_start = '${companyData.work_start}', 
        work_end = '${companyData.work_end}', 
        location_lat = '${companyData.location_lat}', 
        location_long = '${companyData.location_long}', 
        updated_at=CURRENT_TIMESTAMP 
      WHERE 
        id = '${companyId}'
      ;`);

    // response if update company data process is success
    res.json({
      success: true,
      data: null,
      message: "Data perusahaan berhasil diubah",
    });
  } catch (err) {
    // write error message to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data perusahaan gagal diubah",
    });
  }
}

// delete company data from companiess table in database
async function deleteCompany(req, res) {
  // get 'id' company from url
  const companyId = req.params.id;
  try {
    // query for delete company data
    const result = await pool.query(`
      DELETE FROM 
        companies 
      WHERE 
        id = ${companyId}
      ;`);

    // response if delete process is success
    res.json({
      success: true,
      data: null,
      message: "Data perusahaan berhasil dihapus",
    });
  } catch (err) {
    // write error to terminal
    console.error(err.message);

    // response if process not run or fail
    res.status(500).json({
      success: false,
      message: "Data perusahaan gagal dihapus",
    });
  }
}

// export all function for use to other file or other location
module.exports = {
  getAllCompanies,
  getCompanyById,
  storeCompany,
  updateCompany,
  deleteCompany,
};
