// import package
const pool = require("../../../config/db-pg"); // import koneksi database
require("dotenv").config();

// get all positions data from database
async function getAllPositions(req, res) {
  try {
    const result = await pool.query("SELECT * FROM positions");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// get specifc position data by id from database
async function getPositionById(req, res) {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM positions WHERE id=${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// store new position data to database
async function storePosition(req, res) {
  let positionData = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO positions (name, company_id, created_at, updated_at) VALUES ('${positionData.name}', ${positionData.company_id}, CURRENT_TIMESTAMP, NULL);`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// update position data to database by id
async function updatePosition(req, res) {
  let positionData = req.body;
  const positionId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE positions SET name = '${positionData.name}', company_id = ${positionData.company_id}, updated_at=CURRENT_TIMESTAMP WHERE id = '${positionId}';`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

// delete position data in database by id
async function deletePosition(req, res) {
  const positionId = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM positions WHERE id = ${positionId};`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllPositions,
  getPositionById,
  storePosition,
  updatePosition,
  deletePosition,
};
