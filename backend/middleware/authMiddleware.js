const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization Header format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split "Bearer" and extract the token string token payload
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the secret signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to the req object (excluding password hash)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Move forward to the controller
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, token validation failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

module.exports = protect;
