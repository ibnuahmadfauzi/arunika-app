// import package
const { MongoClient } = require("mongodb");

// create url and namedb variable
const url = "mongodb://127.0.0.1:27017";
const dbName = "arunikacore_db";

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

// get all users data from database
async function getAllUsers(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse users collections in database" });
  } finally {
    await client.close();
  }
}

// get specifc user data by id from database
async function getUserById(req, res) {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    const user = await db.collection("users").findOne({ id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get user from database" });
  } finally {
    await client.close();
  }
}

// store new user data to database
async function storeUser(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let userData = req.body;
    const modifiedUser = {
      id: Math.floor(Math.random() * 10000000),
      name: userData.name || "Empty Name",
      email: userData.email || "Empty Email",
      password: userData.password || "Empty Password",
      role_id: userData.role_id || "Empty",
      position_id: userData.position_id || "Empty",
      updated_at: "",
      created_at: getCurrentTimestamp(),
    };

    const users = await db
      .collection("users")
      .insertOne(modifiedUser, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse users collections in database" });
  } finally {
    await client.close();
  }
}

// update user data to database by id
async function updateUser(req, res) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let userData = req.body;

    const userId = parseInt(req.params.id);

    let myquery = { id: userId };
    let newvalues = {
      $set: {
        name: userData.name || "Empty Name",
        email: userData.email || "Empty Email",
        password: userData.password || "Empty Password",
        role_id: userData.role_id || "Empty",
        position_id: userData.position_id || "Empty",
        updated_at: getCurrentTimestamp(),
      },
    };

    const users = await db
      .collection("users")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to parse users collections in database" });
  } finally {
    await client.close();
  }
}

// delete user data in database by id
async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Berhasil terkoneksi ke MongoDB");

    const db = client.db(dbName);
    let myquery = { id: userId };
    const user = await db
      .collection("users")
      .deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error saat mengambil data:", err);
    res.status(500).json({ error: "Failed to get user from database" });
  } finally {
    await client.close();
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser,
};
