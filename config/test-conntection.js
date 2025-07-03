const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; // ganti dari localhost ke 127.0.0.1
const client = new MongoClient(url, {
  serverSelectionTimeoutMS: 5000,
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB at 127.0.0.1:27017");
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err.message);
  } finally {
    await client.close();
  }
}

run();
