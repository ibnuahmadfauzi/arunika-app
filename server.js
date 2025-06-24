const express = require("express");
const absensiRoutes = require("./routes/absensi");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/absensi", absensiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
