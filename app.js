require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("./config/db");
require("dotenv").config();

const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/register", async (req, res) => {
  const { name, email, password, role_id, position_id } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id, position_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, NULL) RETURNING id, name, email",
      [name, email, hashed, role_id, position_id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "User tidak ditemukan" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function authenticate(req, res, next) {
  console.log(">>> Header Authorization:", req.headers.authorization); // DEBUG

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token dibutuhkan" });

  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = decoded;
    next();
  });
}

app.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Login sukses!", user: req.user });
});

// middleware

// route
app.use("/absensi", absensiRouter);
app.use("/arunikacore", arunikaCoreRouter);

app.get("/", (req, res) => {
  res.send("Main application home page");
});

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
