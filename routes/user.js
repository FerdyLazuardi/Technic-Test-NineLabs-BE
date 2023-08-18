const router = require("express").Router();

// controller
const User = require("../controller/userController");

// API auth
router.post("/register", User.register);
router.post("/login", User.login);
router.post("/generate-link", User.resetGenerateLink);
router.put("/reset-password", User.resetPassword);
router.post("/verify", User.verifyOTP);
router.delete("/:id", User.deleteUser);

module.exports = router;
