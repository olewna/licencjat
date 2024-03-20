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
router.post("/", createMusic);

// DELETE music
router.delete("/:id", deleteMusic);

// UPDATE music
router.patch("/:id", updateMusic);

module.exports = router;
