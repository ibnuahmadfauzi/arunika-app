// import package
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
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

// get all rules data from database
async function getAllRules(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const rules = await db.collection("rules").find({}).toArray();
    res.json(rules);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse rules collections in database" });
  } finally {
    await client.close();
  }
}

// get specifc rule data by id from database
async function getRuleById(req, res) {
  const id = req.params.id;
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const rule = await db
      .collection("rules")
      .findOne({ _id: new ObjectId(id) });

    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    res.json(rule);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get rule from database" });
  } finally {
    await client.close();
  }
}

// store new rule data to database
async function storeRule(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let ruleData = req.body;
    const modifiedRule = {
      name: ruleData.name || "Unnamed Rule",
      updated_at: "",
      created_at: getCurrentTimestamp(),
    };

    const rules = await db
      .collection("rules")
      .insertOne(modifiedRule, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    res.json(rules);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse rules collections in database" });
  } finally {
    await client.close();
  }
}

// update rule data to database by id
async function updateRule(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let ruleData = req.body;

    const ruleId = req.params.id;

    let myquery = { _id: new ObjectId(ruleId) };
    let newvalues = {
      $set: {
        name: ruleData.name || "Unnamed Rule",
        updated_at: getCurrentTimestamp(),
      },
    };

    const rules = await db
      .collection("rules")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    res.json(rules);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse rules collections in database" });
  } finally {
    await client.close();
  }
}

// delete rule data in database by id
async function deleteRule(req, res) {
  const ruleId = req.params.id;
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let myquery = { _id: new ObjectId(ruleId) };
    const rule = await db
      .collection("rules")
      .deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });

    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    res.json(rule);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get rule from database" });
  } finally {
    await client.close();
  }
}

module.exports = {
  getAllRules,
  getRuleById,
  storeRule,
  updateRule,
  deleteRule,
};
