const express = require("express");
const {
  verifyToken,
  getUser,
  registerUser,
  loginUser,
  getUserById,
  getTodayCombo,
} = require("../controllers/userController.js");

const router = express.Router();

//GET user
router.get("/", verifyToken, getUser);

//GET user
router.get("/user/:id", getUserById);

//GET today combo
router.get("/combo/:id", getTodayCombo);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

module.exports = router;
