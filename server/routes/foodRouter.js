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
router.post("/", createFood);

// DELETE Food
router.delete("/:id", deleteFood);

// UPDATE Food
router.patch("/:id", updateFood);

module.exports = router;
