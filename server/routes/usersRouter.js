const express = require("express");
const {
  verifyToken,
  getUser,
  registerUser,
  loginUser,
  getUserById,
} = require("../controllers/userController.js");

const router = express.Router();

//GET user
router.get("/", verifyToken, getUser);

//GET user
router.get("/user/:id", getUserById);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

module.exports = router;
