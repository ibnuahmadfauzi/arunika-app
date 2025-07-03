const { MongoClient } = require("mongodb");

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

const positionsData = [
  {
    id: 1,
    company_id: 1,
    name: "CEO",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 2,
    company_id: 1,
    name: "CMD",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 3,
    company_id: 1,
    name: "HCA",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 4,
    company_id: 1,
    name: "GA - Asset",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 5,
    company_id: 1,
    name: "FTAP",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 6,
    company_id: 1,
    name: "MIS - IT",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 7,
    company_id: 1,
    name: "IT Staff",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 8,
    company_id: 1,
    name: "TSD",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 9,
    company_id: 1,
    name: "AP",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 10,
    company_id: 1,
    name: "CT",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 11,
    company_id: 2,
    name: "Dir Ops KDR",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 12,
    company_id: 4,
    name: "Dir Ops CMB",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 13,
    company_id: 3,
    name: "Dir Ops ADK",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 14,
    company_id: 4,
    name: "Drafter CMB",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 15,
    company_id: 3,
    name: "Drafter ADK",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 16,
    company_id: 2,
    name: "Field Staff Spv.",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 17,
    company_id: 2,
    name: "Field Staff",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 18,
    company_id: 1,
    name: "Office Boy",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 19,
    company_id: 1,
    name: "Security",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
];

const rulesData = [
  {
    id: 1,
    name: "Admin",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
  },
  {
    id: 2,
    name: "User",
    updated_at: "",
    created_at: "2025-07-01 10:40:00",
  },
];

const usersData = [
  {
    id: 1,
    name: "Ibnu Ahmad Fauzi",
    email: "ibnu7897@gmail.com",
    password: "12345678",
    role_id: "2",
    position_id: "7",
    updated_at: "",
    created_at: "2025-07-01 10:30:45",
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
