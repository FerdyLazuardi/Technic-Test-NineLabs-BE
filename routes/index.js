const router = require("express").Router();

const User = require("./user");

// API server
router.use("/api/v1/user/", User);

module.exports = router;
