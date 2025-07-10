const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { options } = require("./auth.routes");
const { json } = require("express");

exports.register = async (req, res) => {
  const { name, email, password, role_id, position_id } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id, position_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, NULL) RETURNING id, name, email",
      [name, email, hashed, role_id, position_id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "User tidak ditemukan" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const options = {
      maxAge: 60 * 3600,
      sameSite: "None",
      secure: true,
    };

    // set cookie client
    res
      .cookie("SessionID", token, options)
      .status(200)
      .json({
        status: "success",
        data: {
          name: user.name,
          email: user.email,
          position: "IT Staff",
        },
        message: "Login Berhasil",
      });
    // set response
    // res.status(200).json({
    //   status : "success",
    //   data : {
    //     "name" : user.name,
    //     "email" : user.email,
    //     "position" : "IT Staff"
    //   },
    //   message : "Login Berhasil",
    // })
    // res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.profile = (req, res) => {
  res.json({ message: "Login sukses!", user: req.user });
};
