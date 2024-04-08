const express = require("express");
const {
  getFood,
  createFood,
  deleteFood,
  updateFood,
  getSearchedFood,
  getRandomFood,
  getFoodById,
} = require("../controllers/foodController.js");
const { verifyToken } = require("../controllers/userController.js");

const router = express.Router();

//GET all food
router.get("/search", getFood);

//GET random food
router.get("/random", getRandomFood);

//GET searched
router.get("/search/:nazwa", getSearchedFood);

//GET by id
router.get("/:id", getFoodById);

// POST new Food
router.post("/", verifyToken, createFood);

// DELETE Food
router.delete("/:id", verifyToken, deleteFood);

// UPDATE Food
router.patch("/:id", verifyToken, updateFood);

module.exports = router;
