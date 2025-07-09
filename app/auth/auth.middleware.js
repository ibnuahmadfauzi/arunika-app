const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // const auth = req.headers.authorization;
  const cookie = req.cookies.SessionID

  // if (!auth) return res.status(401).json({ error: "Token dibutuhkan" });
  if (!cookie) return res.status(401).json({ error: "Unautorized" });

  // // const token = auth.split(" ")[1];
  // // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Session Expired" });
    req.user = decoded;
    next();
  });
}

module.exports = authenticate;
