require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const sessionConfig = require("./config/session");

const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");
const authRouter = require("./app/auth/auth-routes");

const requireLogin = require("./middleware/authMidleware");

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionConfig);

// route
app.use("/auth", authRouter);
app.use("/absensi", absensiRouter);
app.use("/arunikacore", requireLogin, arunikaCoreRouter);

app.get("/", (req, res) => {
  res.send("Main application home page");
});

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
