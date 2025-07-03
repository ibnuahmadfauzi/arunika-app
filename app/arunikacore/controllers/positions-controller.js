// import package
const { MongoClient } = require("mongodb");
require("dotenv").config();

// create url and namedb variable
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;

// Universal Function
// get time for updated_at and created_at
function getCurrentTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// get all positions data from database
async function getAllPositions(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const positions = await db.collection("positions").find({}).toArray();
    res.json(positions);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse positions collections in database" });
  } finally {
    await client.close();
  }
}

// get specifc position data by id from database
async function getPositionById(req, res) {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const position = await db.collection("positions").findOne({ id: id });

    if (!position) {
      return res.status(404).json({ error: "Position not found" });
    }

    res.json(position);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get position from database" });
  } finally {
    await client.close();
  }
}

// store new position data to database
async function storePosition(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let positionData = req.body;
    const modifiedPosition = {
      id: Math.floor(Math.random() * 10000000),
      name: positionData.name || "Unnamed Position",
      company_id: positionData.company_id || "Empty",
      updated_at: "",
      created_at: getCurrentTimestamp(),
    };

    const positions = await db
      .collection("positions")
      .insertOne(modifiedPosition, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    res.json(positions);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse positions collections in database" });
  } finally {
    await client.close();
  }
}

// update position data to database by id
async function updatePosition(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let positionData = req.body;

    const positionId = parseInt(req.params.id);

    let myquery = { id: positionId };
    let newvalues = {
      $set: {
        name: positionData.name || "Unnamed Position",
        company_id: positionData.company_id || "Empty",
        updated_at: getCurrentTimestamp(),
      },
    };

    const positions = await db
      .collection("positions")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    res.json(positions);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse positions collections in database" });
  } finally {
    await client.close();
  }
}

// delete position data in database by id
async function deletePosition(req, res) {
  const positionId = parseInt(req.params.id);
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let myquery = { id: positionId };
    const position = await db
      .collection("positions")
      .deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });

    if (!position) {
      return res.status(404).json({ error: "Position not found" });
    }

    res.json(position);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get position from database" });
  } finally {
    await client.close();
  }
}

module.exports = {
  getAllPositions,
  getPositionById,
  storePosition,
  updatePosition,
  deletePosition,
};
