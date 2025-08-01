require("dotenv").config();
const express = require("express");
const cookiesParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");
const authRouter = require("./app/auth/auth.routes");
const authenticate = require("./app/auth/auth.middleware");

const app = express();
app.use(express.json());
app.use(cookiesParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const port = process.env.PORT || 8080;

// routes
app.use("/auth", authRouter);
app.use("/absensi", authenticate, absensiRouter);
app.use("/arunikacore", authenticate, arunikaCoreRouter);
app.use(
  "/image/absensi",
  express.static(path.join(__dirname, "app/absensi/uploads"))
);
app.use(
  "/image/user",
  express.static(path.join(__dirname, "app/arunikacore/uploads"))
);

// root route
app.get("/", (req, res) => {
  res.send("Main application home page");
});

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
