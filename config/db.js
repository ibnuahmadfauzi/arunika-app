const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "arunikacore";

const client = new MongoClient(url);

async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("✅ Terhubung ke MongoDB");
  }
  return client.db(dbName);
}

module.exports = connectDB;
