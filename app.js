require("dotenv").config();
const express = require("express");
const cors = require("cors");


const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");
const authRouter = require("./app/auth/auth.routes");
const authenticate = require("./app/auth/auth.middleware");
const app = express();


// Izinkan semua origin (untuk testing)
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));


app.use(express.json());

const port = process.env.PORT || 8080;

// routes
app.use("/auth", authRouter);
app.use("/absensi", authenticate, absensiRouter);
app.use("/arunikacore", authenticate, arunikaCoreRouter);

// root route
app.get("/", (req, res) => {
  res.send("Main application home page");
});

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
