const express = require("express");

const {
  getMusic,
  createMusic,
  deleteMusic,
  updateMusic,
  getSearchedMusic,
  getRandomMusic,
  getMusicById,
} = require("../controllers/musicController.js");
const { verifyToken } = require("../controllers/userController.js");

const router = express.Router();

//GET all music
router.get("/search", getMusic);

//GET random music
router.get("/random", getRandomMusic);

// GET searched
router.get("/search/:nazwa", getSearchedMusic);

// GET by id
router.get("/:id", getMusicById);

// POST new music
router.post("/", verifyToken, createMusic);

// DELETE music
router.delete("/:id", verifyToken, deleteMusic);

// UPDATE music
router.patch("/:id", verifyToken, updateMusic);

module.exports = router;
