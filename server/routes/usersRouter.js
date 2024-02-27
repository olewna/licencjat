const express = require("express");
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controllers/userController.js");

const router = express.Router();

//GET all users
router.get("/", getUsers);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

module.exports = router;
