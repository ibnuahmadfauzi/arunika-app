// import module
const express = require("express");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");

require("dotenv").config();

const app = express();

// set variable and value from env file
const port = process.env.PORT;
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_ARUNIKACORE;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// route for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection("users").findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

// route for profile
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({ message: "Profile accessed", user: req.session.user });
});

// route for logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// use the routers
app.use("/absensi", absensiRouter);
app.use("/arunikacore", arunikaCoreRouter);

app.get("/", (req, res) => {
  res.send("Main application home page");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
