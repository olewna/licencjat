const express = require("express");
const {
  getGames,
  createGames,
  deleteGames,
  updateGames,
  getSearchedGames,
  getRandomGame,
  getGameById,
} = require("../controllers/gamesController.js");
const { verifyToken } = require("../controllers/userController.js");

const router = express.Router();

//GET all games
router.get("/search", getGames);

//GET random game
router.get("/random", getRandomGame);

// GET searched
router.get("/search/:nazwa", getSearchedGames);

// GET by id
router.get("/:id", getGameById);

// POST new games
router.post("/", verifyToken, createGames);

// DELETE games
router.delete("/:id", verifyToken, deleteGames);

// UPDATE games
router.patch("/:id", verifyToken, updateGames);

module.exports = router;
