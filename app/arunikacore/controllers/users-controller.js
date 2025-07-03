const fs = require("fs");
const path = require("path");

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

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

// Controller for User Data
// Get All User Data
function getAllUsers(req, res) {
  const filePath = path.join(__dirname, "../../../data/users.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse users.json" });
    }
  });
}

// Get Specific User Data
function getUserById(req, res) {
  const filePath = path.join(__dirname, "../../../data/users.json");
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const users = JSON.parse(data);
      const user = users.find((c) => c.id === id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse users.json" });
    }
  });
}

// Store New User Data
function storeUser(req, res) {
  const filePath = path.join(__dirname, "../../../data/users.json");

  // Ambil data baru dari request
  const newUser = req.body;

  // Baca file JSON dulu untuk mendapatkan id terakhir
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const users = JSON.parse(data);
      const lastId = users.length > 0 ? users[users.length - 1].id : 0;

      // Tambahkan data tambahan
      const modifiedUser = {
        id: lastId + 1,
        name: newUser.name || "Unnamed User",
        email: newUser.email || "Empty Email",
        password: newUser.password || "Empty Password",
        role_id: newUser.role_id || "Not Set",
        position_id: newUser.position_id || "Not Set",
        updated_at: "", // bisa nanti diisi waktu update
        created_at: getCurrentTimestamp(),
      };

      // Simpan ke array dan tulis ulang ke file
      users.push(modifiedUser);

      fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.status(201).json({
          message: "User saved",
          user: modifiedUser,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse users.json:", parseErr);
      res.status(500).json({ error: "Failed to parse users.json" });
    }
  });
}

// Update User Data
function updateUser(req, res) {
  const filePath = path.join(__dirname, "../../../data/users.json");
  const userId = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let users = JSON.parse(data);
      const index = users.findIndex((c) => c.id === userId);

      if (index === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update data & set updated_at timestamp
      users[index] = {
        ...users[index],
        ...updatedData,
        updated_at: getCurrentTimestamp(),
      };

      // Simpan kembali ke file
      fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.json({
          message: "User updated successfully",
          user: users[index],
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse users.json:", parseErr);
      res.status(500).json({ error: "Failed to parse users.json" });
    }
  });
}

// delete user data
function deleteUser(req, res) {
  const filePath = path.join(__dirname, "../../../data/users.json");
  const userId = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let users = JSON.parse(data);
      const index = users.findIndex((c) => c.id === userId);

      if (index === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hapus user dari array
      const deletedUser = users.splice(index, 1)[0];

      // Simpan ulang ke file
      fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to delete user" });
        }

        res.json({
          message: "User deleted successfully",
          deleted: deletedUser,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse users.json:", parseErr);
      res.status(500).json({ error: "Failed to parse users.json" });
    }
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser,
};
