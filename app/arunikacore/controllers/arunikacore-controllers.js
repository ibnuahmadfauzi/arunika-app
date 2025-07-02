const fs = require("fs");
const path = require("path");

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

// Universal Function

// get time for updated_at and created_at
function getCurrentTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

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

// Store New Company Data
function storeCompany(req, res) {
  const filePath = path.join(__dirname, "../../../data/companies.json");

  // Ambil data baru dari request
  const newCompany = req.body;

  // Baca file JSON dulu untuk mendapatkan id terakhir
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const companies = JSON.parse(data);
      const lastId =
        companies.length > 0 ? companies[companies.length - 1].id : 0;

      // Tambahkan data tambahan
      const modifiedCompany = {
        id: lastId + 1,
        name: newCompany.name || "Unnamed Company",
        updated_at: "", // bisa nanti diisi waktu update
        created_at: getCurrentTimestamp(),
      };

      // Simpan ke array dan tulis ulang ke file
      companies.push(modifiedCompany);

      fs.writeFile(filePath, JSON.stringify(companies, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.status(201).json({
          message: "Company saved",
          company: modifiedCompany,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse companies.json:", parseErr);
      res.status(500).json({ error: "Failed to parse companies.json" });
    }
  });
}

// Update Company Data
function updateCompany(req, res) {
  const filePath = path.join(__dirname, "../../../data/companies.json");
  const companyId = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let companies = JSON.parse(data);
      const index = companies.findIndex((c) => c.id === companyId);

      if (index === -1) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Update data & set updated_at timestamp
      companies[index] = {
        ...companies[index],
        ...updatedData,
        updated_at: getCurrentTimestamp(),
      };

      // Simpan kembali ke file
      fs.writeFile(filePath, JSON.stringify(companies, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.json({
          message: "Company updated successfully",
          company: companies[index],
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse companies.json:", parseErr);
      res.status(500).json({ error: "Failed to parse companies.json" });
    }
  });
}

// delete company data
function deleteCompany(req, res) {
  const filePath = path.join(__dirname, "../../../data/companies.json");
  const companyId = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let companies = JSON.parse(data);
      const index = companies.findIndex((c) => c.id === companyId);

      if (index === -1) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Hapus company dari array
      const deletedCompany = companies.splice(index, 1)[0];

      // Simpan ulang ke file
      fs.writeFile(filePath, JSON.stringify(companies, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to delete company" });
        }

        res.json({
          message: "Company deleted successfully",
          deleted: deletedCompany,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse companies.json:", parseErr);
      res.status(500).json({ error: "Failed to parse companies.json" });
    }
  });
}

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

// Controller for Positions Data
// Get all positions data
function getAllPositions(req, res) {
  const filePath = path.join(__dirname, "../../../data/positions.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const positions = JSON.parse(data);
      res.json(positions);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse positions.json" });
    }
  });
}

// Get specific position data
function getPositionById(req, res) {
  const filePath = path.join(__dirname, "../../../data/positions.json");
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const positions = JSON.parse(data);
      const position = positions.find((c) => c.id === id);

      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }

      res.json(position);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse positions.json" });
    }
  });
}

// Store New Position Data
function storePosition(req, res) {
  const filePath = path.join(__dirname, "../../../data/positions.json");

  // Ambil data baru dari request
  const newPosition = req.body;

  // Baca file JSON dulu untuk mendapatkan id terakhir
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const positions = JSON.parse(data);
      const lastId =
        positions.length > 0 ? positions[positions.length - 1].id : 0;

      // Tambahkan data tambahan
      const modifiedPosition = {
        id: lastId + 1,
        company_id: newPosition.company_id,
        name: newPosition.name || "Unnamed Position",
        updated_at: "", // bisa nanti diisi waktu update
        created_at: getCurrentTimestamp(),
      };

      // Simpan ke array dan tulis ulang ke file
      positions.push(modifiedPosition);

      fs.writeFile(filePath, JSON.stringify(positions, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.status(201).json({
          message: "Position saved",
          position: modifiedPosition,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse positions.json:", parseErr);
      res.status(500).json({ error: "Failed to parse positions.json" });
    }
  });
}

// Update Position Data
function updatePosition(req, res) {
  const filePath = path.join(__dirname, "../../../data/positions.json");
  const positionId = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let positions = JSON.parse(data);
      const index = positions.findIndex((c) => c.id === positionId);

      if (index === -1) {
        return res.status(404).json({ error: "Position not found" });
      }

      // Update data & set updated_at timestamp
      positions[index] = {
        ...positions[index],
        ...updatedData,
        updated_at: getCurrentTimestamp(),
      };

      // Simpan kembali ke file
      fs.writeFile(filePath, JSON.stringify(positions, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.json({
          message: "position updated successfully",
          position: positions[index],
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse positions.json:", parseErr);
      res.status(500).json({ error: "Failed to parse positions.json" });
    }
  });
}

// Delete position data
function deletePosition(req, res) {
  const filePath = path.join(__dirname, "../../../data/positions.json");
  const positionId = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let positions = JSON.parse(data);
      const index = positions.findIndex((c) => c.id === positionId);

      if (index === -1) {
        return res.status(404).json({ error: "position not found" });
      }

      // Hapus position dari array
      const deletedPosition = positions.splice(index, 1)[0];

      // Simpan ulang ke file
      fs.writeFile(filePath, JSON.stringify(positions, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to delete Position" });
        }

        res.json({
          message: "Position deleted successfully",
          deleted: deletedPosition,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse positions.json:", parseErr);
      res.status(500).json({ error: "Failed to parse positions.json" });
    }
  });
}

// ======================================================================================== //
// ======================================================================================== //
// ======================================================================================== //

// Controller for Rules Data
// Get All Rules Data
function getAllRules(req, res) {
  const filePath = path.join(__dirname, "../../../data/rules.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const rules = JSON.parse(data);
      res.json(rules);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse rules.json" });
    }
  });
}

// Get Specific Rule Data
function getRuleById(req, res) {
  const filePath = path.join(__dirname, "../../../data/rules.json");
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const rules = JSON.parse(data);
      const rule = rules.find((c) => c.id === id);

      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }

      res.json(rule);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse rules.json" });
    }
  });
}

// Store New Rule Data
function storeRule(req, res) {
  const filePath = path.join(__dirname, "../../../data/rules.json");

  // Ambil data baru dari request
  const newRule = req.body;

  // Baca file JSON dulu untuk mendapatkan id terakhir
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const rules = JSON.parse(data);
      const lastId = rules.length > 0 ? rules[rules.length - 1].id : 0;

      // Tambahkan data tambahan
      const modifiedRule = {
        id: lastId + 1,
        name: newRule.name || "Unnamed Rule",
        updated_at: "", // bisa nanti diisi waktu update
        created_at: getCurrentTimestamp(),
      };

      // Simpan ke array dan tulis ulang ke file
      rules.push(modifiedRule);

      fs.writeFile(filePath, JSON.stringify(rules, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.status(201).json({
          message: "Rule saved",
          rule: modifiedRule,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse rules.json:", parseErr);
      res.status(500).json({ error: "Failed to parse rules.json" });
    }
  });
}

// Update Rule Data
function updateRule(req, res) {
  const filePath = path.join(__dirname, "../../../data/rules.json");
  const ruleId = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let rules = JSON.parse(data);
      const index = rules.findIndex((c) => c.id === ruleId);

      if (index === -1) {
        return res.status(404).json({ error: "Rule not found" });
      }

      // Update data & set updated_at timestamp
      rules[index] = {
        ...rules[index],
        ...updatedData,
        updated_at: getCurrentTimestamp(),
      };

      // Simpan kembali ke file
      fs.writeFile(filePath, JSON.stringify(rules, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to save data" });
        }

        res.json({
          message: "Company updated successfully",
          rule: rules[index],
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse rules.json:", parseErr);
      res.status(500).json({ error: "Failed to parse rules.json" });
    }
  });
}

// delete rule data
function deleteRule(req, res) {
  const filePath = path.join(__dirname, "../../../data/rules.json");
  const ruleId = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      let rules = JSON.parse(data);
      const index = rules.findIndex((c) => c.id === ruleId);

      if (index === -1) {
        return res.status(404).json({ error: "Rule not found" });
      }

      // Hapus rule dari array
      const deletedRule = rules.splice(index, 1)[0];

      // Simpan ulang ke file
      fs.writeFile(filePath, JSON.stringify(rules, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write file:", writeErr);
          return res.status(500).json({ error: "Failed to delete rule" });
        }

        res.json({
          message: "Rule deleted successfully",
          deleted: deletedRule,
        });
      });
    } catch (parseErr) {
      console.error("Failed to parse rules.json:", parseErr);
      res.status(500).json({ error: "Failed to parse rules.json" });
    }
  });
}

module.exports = {
  getAllCompanies,
  getCompanyById,
  storeCompany,
  updateCompany,
  deleteCompany,
  getAllPositions,
  getPositionById,
  storePosition,
  updatePosition,
  deletePosition,
  getAllRules,
  getRuleById,
  storeRule,
  updateRule,
  deleteRule,
};
