require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id, role) => {
  if (!process.env.TOKEN_KEY) {
    throw new Error("JWT secret TOKEN_KEY is not defined in .env!");
  }

  const token = jwt.sign(
    { id: id, role: role },
    process.env.TOKEN_KEY,
    { expiresIn: 3 * 24 * 60 * 60 } // 3 days
  );

  return token;
};