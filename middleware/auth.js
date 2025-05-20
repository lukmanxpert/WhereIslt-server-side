const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "unauthorize access"
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = auth;
