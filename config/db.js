const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;
const client = new MongoClient(url);

async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = connectDB;
