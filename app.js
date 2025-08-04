// import dotenv package
require("dotenv").config();

// import express package
const express = require("express");

// import cookie-parser package
const cookiesParser = require("cookie-parser");

// include daily job for auto check out user
const startDailyJob = require("./cron/dailyJob");

// import cors package
const cors = require("cors");

// import path package
const path = require("path");

// include route for absensi app
const absensiRouter = require("./app/absensi/routes/absensi-routes");

// include route for arunikacore app
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");

// include route for auth app
const authRouter = require("./app/auth/auth.routes");
const authenticate = require("./app/auth/auth.middleware");

// app definitio use express
const app = express();
app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// port definitio for listen
const port = process.env.PORT || 8080;

// memanggil cron scheduler
startDailyJob();

// route for auth app
app.use("/auth", authRouter);

// route for absensi app
app.use("/absensi", authenticate, absensiRouter);

// route for arunikacore app
app.use("/arunikacore", authenticate, arunikaCoreRouter);

// endpoin static upload file to '/image/absensi'
app.use(
  "/image/absensi",
  express.static(path.join(__dirname, "app/absensi/uploads"))
);

// endpoin static upload file to '/image/user'
app.use(
  "/image/user",
  express.static(path.join(__dirname, "app/arunikacore/uploads"))
);

// route for root endpoin
app.get("/", (req, res) => {
  res.send("Main application home page");
});

// function for start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
