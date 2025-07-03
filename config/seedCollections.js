const { MongoClient } = require("mongodb");
const companiesData = require("../data/companies.json");
const positionsData = require("../data/positions.json");
const rulesData = require("../data/rules.json");
const usersData = require("../data/users.json");

const url = "mongodb://127.0.0.1:27017";
const dbName = "arunikacore_db";
const client = new MongoClient(url);

async function createDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);

    // Membuat collection kosong untuk memicu pembuatan database
    await db.createCollection("dummy_init");
    await db.collection("dummy_init").drop(); // Hapus lagi jika tidak dibutuhkan

    console.log(`✅ Database "${dbName}" berhasil dibuat (jika belum ada)`);
  } catch (err) {
    console.error("❌ Gagal membuat database:", err);
  }
}

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

async function seedPositions() {
  try {
    await client.connect();
    console.log("✅ Terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("positions");

    // Hapus collection jika sudah ada
    await collection.deleteMany({});

    // Masukkan data baru
    const result = await collection.insertMany(positionsData);
    console.log(
      `✅ ${result.insertedCount} data berhasil ditambahkan ke koleksi "positions"`
    );
  } catch (err) {
    console.error("❌ Gagal melakukan seeding:", err);
  } finally {
    await client.close();
    console.log("🔌 Koneksi MongoDB ditutup");
  }
}

async function seedRules() {
  try {
    await client.connect();
    console.log("✅ Terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("rules");

    // Hapus collection jika sudah ada
    await collection.deleteMany({});

    // Masukkan data baru
    const result = await collection.insertMany(rulesData);
    console.log(
      `✅ ${result.insertedCount} data berhasil ditambahkan ke koleksi "rules"`
    );
  } catch (err) {
    console.error("❌ Gagal melakukan seeding:", err);
  } finally {
    await client.close();
    console.log("🔌 Koneksi MongoDB ditutup");
  }
}

async function seedUsers() {
  try {
    await client.connect();
    console.log("✅ Terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("users");

    // Hapus collection jika sudah ada
    await collection.deleteMany({});

    // Masukkan data baru
    const result = await collection.insertMany(usersData);
    console.log(
      `✅ ${result.insertedCount} data berhasil ditambahkan ke koleksi "users"`
    );
  } catch (err) {
    console.error("❌ Gagal melakukan seeding:", err);
  } finally {
    await client.close();
    console.log("🔌 Koneksi MongoDB ditutup");
  }
}

async function main() {
  await createDatabase();
  await seedRules();
  await seedUsers();
  await seedPositions();
  await seedCompanies();
}

main();
