require("dotenv").config();
const express = require("express");

const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");
const authRouter = require("./app/auth/auth.routes");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// routes
app.use("/auth", authRouter);
app.use("/absensi", absensiRouter);
app.use("/arunikacore", arunikaCoreRouter);

// root route
app.get("/", (req, res) => {
  res.send("Main application home page");
});

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
