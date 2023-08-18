const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = async function (req, res, next) {
  try {
    // check jika request header authorization ada atau gak
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "failed",
        message: "Token Gak ada/authorization nya gak ada",
      });
    }

    const bearerToken = req.headers.authorization;
    // req.headers.authorization => bearer authentication

    const token = bearerToken.split("Bearer ")[1];
    console.log(token);

    // jwt verifikasi tokennya
    const payload = jwt.verify(token, "rahasia");
    console.log(payload);

    const User = await user.findByPk(payload.id);
    req.user = User;
    next();
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
