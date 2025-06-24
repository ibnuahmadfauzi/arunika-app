const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "absensi.json");

function readData() {
  if (!fs.existsSync(filePath)) return [];
  const fileData = fs.readFileSync(filePath, "utf8");
  return fileData ? JSON.parse(fileData) : [];
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData,
};
