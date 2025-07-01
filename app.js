const express = require("express");
const absensiRouter = require("./app/absensi/routes/absensi-routes");
const arunikaCoreRouter = require("./app/arunikacore/routes/arunikacore-routes");

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routers
app.use("/absensi", absensiRouter);
app.use("/arunikacore", arunikaCoreRouter);

app.get("/", (req, res) => {
  res.send("Main application home page");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
