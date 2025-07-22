// import package
const pool = require("../../../config/db");
require("dotenv").config();

// get all companies data from database
async function getAllCompanies(req, res) {
  try {
    const result = await pool.query("SELECT id, name FROM companies");
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Berhasil mengambil semua data perusahaan",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data perusahaan kosong",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data perusahaan gagal ditampilkan",
    });
  }
}

// get specifc company data by id from database
async function getCompanyById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT id, name, work_start, work_end, location_lat, location_long FROM companies WHERE id=${id}`
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows,
        message: "Data perusahaan berhasil diambil",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "ID perusahaan tidak ditemukan",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// store new company data to database
async function storeCompany(req, res) {
  let companyData = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO companies (name, created_at, updated_at, work_start, work_end, location_lat, location_long) VALUES ('${companyData.name}', CURRENT_TIMESTAMP, NULL, '${companyData.work_start}', '${companyData.work_end}', '${companyData.location_lat}', '${companyData.location_long}');`
    );
    res.json({
      success: true,
      data: null,
      message: "Data perusahaan berhasil ditambahkan",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: "Data perusahaan gagal ditambahkan",
    });
  }
}

// update company data to database by id
async function updateCompany(req, res) {
  let companyData = req.body;
  const companyId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE companies SET name = '${companyData.name}', work_start = '${companyData.work_start}', work_end = '${companyData.work_end}', location_lat = '${companyData.location_lat}', location_long = '${companyData.location_long}', updated_at=CURRENT_TIMESTAMP WHERE id = '${companyId}';`
    );
    res.json({
      success: true,
      data: null,
      message: "Data perusahaan berhasil diubah",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Data perusahaan gagal diubah",
    });
  }
}

// delete company data in database by id
async function deleteCompany(req, res) {
  const companyId = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM companies WHERE id = ${companyId};`
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: null,
        message: "Data perusahaan berhasil dihapus",
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: "Data perusahaan tidak ditemukan",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Data perusahaan gagal dihapus",
    });
  }
}

module.exports = {
  getAllCompanies,
  getCompanyById,
  storeCompany,
  updateCompany,
  deleteCompany,
};
