// import package
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();

// create url and namedb variable
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;

async function checkOut(req, res) {
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
    let attendanceData = req.body;

    const attendanceId = req.params.id;

    let myquery = { _id: new ObjectId(attendanceId) };
    let newvalues = {
      $set: {
        check_out_time: `${hours}:${minutes}:${seconds}`,
        location_out_lat: attendanceData.location_out_lat,
        location_out_long: attendanceData.location_out_long,
        new_description: attendanceData.description,
        new_photo: attendanceData.photo,
      },
    };

    const attendances = await db
      .collection("attendances")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
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
module.exports = { checkOut };
