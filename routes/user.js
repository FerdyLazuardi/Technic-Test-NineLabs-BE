const router = require("express").Router();

// controller
const User = require("../controller/userController");

// middleware
const Authentication = require("../middlewares/authenticate");

// API auth
router.post("/register", User.register);
router.post("/login", User.login);
router.delete("/:id", User.deleteUser);

module.exports = router;
