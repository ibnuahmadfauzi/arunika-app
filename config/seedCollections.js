const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "arunikacore_db";
const client = new MongoClient(url);

const companiesData = [
  {
    id: 1,
    name: "Arunika",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 2,
    name: "Karta Daya Reksabumi",
    updated_at: "",
    created_at: "2025-07-01 10:40:00",
  },
  {
    id: 3,
    name: "Super User",
    updated_at: "2025-07-02 11:52:48",
    created_at: "2025-07-01 10:50:00",
  },
  {
    id: 4,
    name: "Citalaya Matra Baswara",
    updated_at: "",
    created_at: "2025-07-01 11:15:25",
  },
];

async function seedCompanies() {
  try {
    await client.connect();
    console.log("✅ Terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("companies");

    // Hapus collection jika sudah ada
    await collection.deleteMany({});

    // Masukkan data baru
    const result = await collection.insertMany(companiesData);
    console.log(
      `✅ ${result.insertedCount} data berhasil ditambahkan ke koleksi "companies"`
    );
  } catch (err) {
    console.error("❌ Gagal melakukan seeding:", err);
  } finally {
    await client.close();
    console.log("🔌 Koneksi MongoDB ditutup");
  }
}

seedCompanies();
