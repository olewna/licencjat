const express = require("express");
const {
  verifyToken,
  getUser,
  registerUser,
  loginUser,
  getUserById,
  getTodayCombo,
  addComboToUser,
  updateComboWithOneElement,
} = require("../controllers/userController.js");

const router = express.Router();

//GET user
router.get("/", verifyToken, getUser);

//GET user
router.get("/user/:id", getUserById);

//GET today combo
router.get("/combo/:id", getTodayCombo);

//POST add daily combo to user
router.post("/combo/:id", addComboToUser);

//PUT change one element in combo
router.put("/combo/:id", updateComboWithOneElement);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

module.exports = router;
