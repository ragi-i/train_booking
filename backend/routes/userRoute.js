const express = require("express");
const { userRegisterController, userLoginController } = require("../controllers/userController");

const router = express.Router();

// Register User
router.post("/signup", userRegisterController);

// Login User
router.post("/login", userLoginController);

module.exports = router;
