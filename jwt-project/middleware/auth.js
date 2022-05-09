const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  } else {
    try {
      const decoded = await jwt.verify(token, config.TOKEN_KEY);
      req.User = decoded;
    } catch (err) {
      console.log(err);
      return res.status(401).send("Invalid Token");
    }
  }
  return next();
};

module.exports = verifyToken;
