// import package
const { MongoClient } = require("mongodb");
require("dotenv").config();

// function for generate time
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

// create url and namedb variable
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;

// function to checkin absensi
async function checkIn(req, res) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let dataCheckin = {
      user_id: req.session.user.id,
      date: `${year}-${month}-${day}`,
      check_in_time: `${hours}:${minutes}:${seconds}`,
      check_out_time: "",
      location_in_lat: req.body.location_in_lat,
      location_in_long: req.body.location_in_long,
      location_out_lat: "",
      location_out_long: "",
      description: req.body.description,
      photo: req.body.photo,
    };

    const attendances = await db
      .collection("attendances")
      .insertOne(dataCheckin, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    res.json(attendances);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse attendances collections in database" });
  } finally {
    await client.close();
  }
}

module.exports = { checkIn };
