const fs = require("fs");
const path = require("path");

// Controller for Companies Data
// Get All Companies Data
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
// Get Specific Company Data
function getCompanyById(req, res) {
  const filePath = path.join(__dirname, "../../../data/companies.json");
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const companies = JSON.parse(data);
      const company = companies.find((c) => c.id === id);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json(company);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse companies.json" });
    }
  });
}

module.exports = { getAllCompanies, getCompanyById };
