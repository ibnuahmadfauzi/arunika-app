const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/absensi/uploads/"); // folder tujuan simpan file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname + ".png"));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
