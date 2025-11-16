const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  // Support both raw token and `Bearer <token>` formats
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach the full decoded payload in case it contains name/email
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
