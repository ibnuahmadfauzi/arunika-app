const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { options } = require("./auth.routes");
const { json } = require("express");

exports.check = async (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json({
      success: true,
      message: "User Authorized",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: {
          name: req.user.role.name,
        },
        position: {
          name: req.user.position.name,
        },
        company: {
          name: req.user.company.name,
          work_start: req.user.company.work_start,
          work_end: req.user.company.work_end,
          location_lat: req.user.company.location_lat,
          location_long: req.user.company.location_long,
        },
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "User unauthorized",
    });
  }
};

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

exports.logout = async (req, res) => {
  res.clearCookie("SessionID", {
    httpOnly: true,
    secure: true, // tetap sama dengan opsi cookie saat login
    sameSite: "strict", // tetap sama
  });

  res.status(200).json({
    success: true,
    message: "Logout berhasil",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `
  SELECT 
    u.*,
    r.id AS role_id,
    r.name AS role_name,
    p.id AS position_id,
    p.name AS position_name,
    c.id AS company_id,
    c.name AS company_name,
    c.work_start,
    c.work_end,
    c.location_lat,
    c.location_long
  FROM 
    users u
    JOIN roles r ON u.role_id = r.id
    JOIN positions p ON u.position_id = p.id
    JOIN companies c ON p.company_id = c.id
  WHERE 
    u.email = $1
  `,
      [email]
    );

    if (result.rowCount === 0)
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });

    const data = result.rows[0];
    const match = await bcrypt.compare(password, data.password);
    if (!match) return res.status(401).json({ error: "Password salah" });

    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: {
        name: data.role_name,
      },
      position: {
        name: data.position_name,
      },
      company: {
        name: data.company_name,
        work_start: data.work_start,
        work_end: data.work_end,
        location_lat: data.location_lat,
        location_long: data.location_long,
      },
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

    const options = {
      maxAge: 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    };

    // set cookie client
    res.cookie("SessionID", token, options).status(200).json({
      success: true,
      message: "User Authorized",
      user: user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Email atau password salah",
    });
  }
};

exports.profile = (req, res) => {
  res.json({ message: "Login sukses!", data: req.data });
};
