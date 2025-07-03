const { MongoClient } = require("mongodb");

// Ubah sesuai kebutuhan
const url = "mongodb://127.0.0.1:27017"; // koneksi ke MongoDB lokal
const dbName = "arunikacore_db"; // nama database kamu

async function connectMongo() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const companies = await db.collection("companies").find({}).toArray();

    console.log("📦 Data dari collection 'companies':");
    console.log(companies);
  } catch (err) {
    console.error("❌ Gagal koneksi atau query:", err);
  } finally {
    await client.close();
  }
}

connectMongo();
