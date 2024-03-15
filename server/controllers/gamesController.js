const Games = require("../models/gamesModel");
const mongoose = require("mongoose");

//GET all
const getGames = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  const games = await Games.find({});

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultGames = games
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);

  const totalPages = Math.ceil(games.length / pageSize);
  res.status(200).json({ games: resultGames, allPages: totalPages });
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
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;
  let games;

  if (nazwa) {
    games = await Games.find({
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { type: { $regex: nazwa, $options: "i" } },
      ],
    });
  } else {
    games = await Games.find({});
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultGames = games
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);
  const totalPages = Math.ceil(games.length / pageSize);

  res.status(200).json({
    games: resultGames,
    allPages: totalPages,
  });
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
