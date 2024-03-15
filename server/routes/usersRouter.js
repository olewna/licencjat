const express = require("express");
const {
  verifyToken,
  getUser,
  registerUser,
  loginUser,
} = require("../controllers/userController.js");

const router = express.Router();

//GET all users
router.get("/", verifyToken, getUser);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

module.exports = router;
