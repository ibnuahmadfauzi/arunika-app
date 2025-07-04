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

// get all companies data from database
async function getAllCompanies(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const companies = await db.collection("companies").find({}).toArray();
    res.json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse companies collections in database" });
  } finally {
    await client.close();
  }
}

// get specifc company data by id from database
async function getCompanyById(req, res) {
  const id = req.params.id;
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const company = await db
      .collection("companies")
      .findOne({ _id: new ObjectId(id) });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get company from database" });
  } finally {
    await client.close();
  }
}

// store new company data to database
async function storeCompany(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let companyData = req.body;
    const modifiedCompany = {
      name: companyData.name || "Unnamed Company",
      updated_at: "",
      created_at: getCurrentTimestamp(),
    };

    const companies = await db
      .collection("companies")
      .insertOne(modifiedCompany, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    res.json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse companies collections in database" });
  } finally {
    await client.close();
  }
}

// update company data to database by id
async function updateCompany(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let companyData = req.body;

    const companyId = req.params.id;

    let myquery = { _id: new ObjectId(companyId) };
    let newvalues = {
      $set: {
        name: companyData.name || "Unnamed Company",
        updated_at: getCurrentTimestamp(),
      },
    };

    const companies = await db
      .collection("companies")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    res.json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse companies collections in database" });
  } finally {
    await client.close();
  }
}

// delete company data in database by id
async function deleteCompany(req, res) {
  const companyId = req.params.id;
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let myquery = { _id: new ObjectId(companyId) };
    const company = await db
      .collection("companies")
      .deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get company from database" });
  } finally {
    await client.close();
  }
}

module.exports = {
  getAllCompanies,
  getCompanyById,
  storeCompany,
  updateCompany,
  deleteCompany,
};
