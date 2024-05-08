const Games = require("../models/gamesModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

//GET all
const getGames = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  let games;
  if (req.user) {
    games = await Games.find({
      $or: [{ author: { $exists: false } }, { author: req.user.userId }],
    });
  } else {
    games = await Games.find({ author: { $exists: false } });
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
  res.status(200).json({ games: resultGames, allPages: totalPages });
};

//GET random
const getRandomGame = async (req, res) => {
  const { singleplayer, multiplayer } = req.query;
  if (singleplayer === "true" || multiplayer === "true") {
    const count = await Games.find({
      singleplayer: singleplayer,
      multiplayer: multiplayer,
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
    });
    const random = Math.floor(Math.random() * count.length);
    const randomGame = await Games.findOne({
      singleplayer: singleplayer,
      multiplayer: multiplayer,
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
    })
      .skip(random)
      .limit(1);
    return res.status(200).json(randomGame);
  } else {
    const count = await Games.find({
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
    });
    const random = Math.floor(Math.random() * count.length);
    const randomGame = await Games.findOne({
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
    })
      .skip(random)
      .limit(1);
    return res.status(200).json(randomGame);
  }
};

//GET by id
const getGameById = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Games.findOne({ id: id });
    return res.status(200).json(game);
  } catch {
    return res.status(404).json({ message: "Game with given id not found" });
  }
};

//GET searched
const getSearchedGames = async (req, res) => {
  const { nazwa } = req.params;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;
  let games;

  if (nazwa) {
    games = await Games.find({
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { type: { $regex: nazwa, $options: "i" } },
      ],
    });
  } else {
    games = await Games.find({
      $or: req.user
        ? [{ author: { $exists: false } }, { author: req.user.userId }]
        : [{ author: { $exists: false } }],
    });
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
  const { name, type, price, multiplayer, singleplayer, logoUrl } =
    req.body.game;
  try {
    const games = await Games.create({
      name,
      type,
      price,
      id: uuid(),
      author: req.user.userId,
      multiplayer,
      singleplayer,
      logoUrl: logoUrl
        ? logoUrl
        : "https://ucarecdn.com/378b3a04-7d09-4adb-bee0-7220880dd725/pngtreevectorvideogameiconpngimage_4101325.jpg",
    });
    return res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//DELETE one
const deleteGames = async (req, res) => {
  const { id } = req.params;

  await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $pull: { favouriteCombos: { gameId: id } } }
  );

  const user = await User.findOne({ _id: req.user.userId });
  const today = new Date().toJSON().slice(0, 10);
  const combo = user.dailyCombo.get(today);
  if (combo && combo.gameId === id) {
    await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $unset: { [`dailyCombo.${today}`]: "" } }
    );
  }
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

  const { logoUrl, ...rest } = req.body.game;

  try {
    const game = await Games.findOneAndUpdate(
      { id: id },
      {
        ...rest,
        logoUrl: logoUrl
          ? logoUrl
          : "https://ucarecdn.com/378b3a04-7d09-4adb-bee0-7220880dd725/pngtreevectorvideogameiconpngimage_4101325.jpg",
      }
    );
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  getGames,
  getGameById,
  createGames,
  deleteGames,
  updateGames,
  getSearchedGames,
  getRandomGame,
};
