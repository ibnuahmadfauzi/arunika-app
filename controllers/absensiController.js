const { readData, writeData } = require("../utils/fileHelper");

const getAllAbsensi = (req, res) => {
  const data = readData();
  res.json(data);
};

const getAbsensiById = (req, res) => {
  const id = req.params.id?.toString();
  const data = readData();

  const found = data.find((item) => item.id === id);

  if (!found) {
    return res
      .status(404)
      .json({ message: "Data dengan ID tersebut tidak ditemukan." });
  }

  res.status(200).json(found);
};

// const addAbsensi = (req, res) => {
//   const { nik, nama, tanggal, jamMasuk } = req.body;
//   if (!nik || !nama || !tanggal || !jamMasuk) {
//     return res.status(400).json({ message: "Data tidak lengkap" });
//   }

//   const data = readData();
//   const newEntry = { nik, nama, tanggal, jamMasuk };
//   data.push(newEntry);
//   writeData(data);
//   res
//     .status(201)
//     .json({ message: "Absensi berhasil ditambahkan", data: newEntry });
// };

module.exports = {
  getAllAbsensi,
  getAbsensiById,
  //   addAbsensi,
};
