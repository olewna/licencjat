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
  checkIfComboFavourite,
  addComboToFavourite,
  deleteComboFromFavourite,
  deleteUser,
  updateUser,
} = require("../controllers/userController.js");

const router = express.Router();

//GET user
router.get("/", verifyToken, getUser);

//GET user
router.get("/user/:id", getUserById);

//GET today combo
router.get("/combo/:id", getTodayCombo);

//POST add daily combo to user
router.post("/combo/:id", verifyToken, addComboToUser);

//PUT change one element in combo
router.put("/combo/:id", updateComboWithOneElement);

//DELETE combo from favourite
router.put(
  "/combo/:id/favourite/delete",
  verifyToken,
  deleteComboFromFavourite
);

//PUT check if favourite
router.put("/combo/:id/favourite", verifyToken, checkIfComboFavourite);

//POST add combo to favourite
router.post("/combo/:id/favourite", verifyToken, addComboToFavourite);

//POST login user
router.post("/login", loginUser);

// POST register user
router.post("/register", registerUser);

// DELETE user
router.delete("/:id", verifyToken, deleteUser);

// PATCH user
router.patch("/:id", verifyToken, updateUser);

module.exports = router;
