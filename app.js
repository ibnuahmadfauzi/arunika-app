const express = require("express");
const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use the routers
app.use("/absensi", absensiRouter);
app.use("/arunikacore", arunikaCoreRouter);

app.get("/", (req, res) => {
  res.send("Main application home page");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
