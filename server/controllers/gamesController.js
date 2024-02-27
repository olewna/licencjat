const Games = require("../models/gamesModel");
const mongoose = require("mongoose");

//GET all
const getGames = async (req, res) => {
  const games = await Games.find({});
  res.status(200).json(games);
};

//GET random
const getRandomGame = async (req, res) => {
  const count = await Games.countDocuments();
  const random = Math.floor(Math.random() * count);
  const randomGame = await Games.findOne().skip(random).limit(1);
  res.status(200).json(randomGame);
};

//GET searched
const getSearchedGames = async (req, res) => {
  const { nazwa } = req.params;

  if (/^[A-Za-z0-9]*$/.test(nazwa)) {
    const games = await Games.find({ name: { $regex: nazwa } });
    if (!games) {
      res.status(200).json({});
    } else {
      res.status(200).json(games);
    }
  }
};

//POST new
const createGames = async (req, res) => {
  const { name, type, price, id } = req.body;
  try {
    const games = await Games.create({ name, type, price, id });
    res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one
const deleteGames = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "games not found!"})
  // }
  const games = await Games.findOneAndDelete({ id: id });

  if (!games) {
    return res.status(400).json({ error: "This game not found!" });
  } else {
    res.status(200).json(games);
  }
};

//UPDATE one
const updateGames = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "games not found!"})
  // }
  const games = await Games.findOneAndUpdate(
    { id: id },
    {
      ...req.body,
    }
  );

  if (!games) {
    return res.status(400).json({ error: "This game not found!" });
  } else {
    res.status(200).json(games);
  }
};

module.exports = {
  getGames,
  createGames,
  deleteGames,
  updateGames,
  getSearchedGames,
  getRandomGame,
};
