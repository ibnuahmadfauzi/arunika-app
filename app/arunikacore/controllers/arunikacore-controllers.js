const fs = require("fs");
const path = require("path");

function getAllCompanies(req, res) {
  const filePath = path.join(__dirname, "../../../data/companies.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const companies = JSON.parse(data);
      res.json(companies);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse companies.json" });
    }
  });
}

module.exports = { getAllCompanies };
