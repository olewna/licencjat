const Music = require("../models/musicModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

//GET all
const getMusic = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  let music;
  if (req.user) {
    music = await Music.find({
      $or: [{ user: { $exists: false } }, { user: req.user.userId }],
    });
  } else {
    music = await Music.find({ user: { $exists: false } });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultMusic = music
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);

  const totalPages = Math.ceil(music.length / pageSize);
  res.status(200).json({ music: resultMusic, allPages: totalPages });
};

const getRandomMusic = async (req, res) => {
  const count = await Music.find({
    $or: req.user
      ? [{ user: { $exists: false } }, { user: req.user.userId }]
      : [{ user: { $exists: false } }],
  });
  const random = Math.floor(Math.random() * count.length);
  const randomMusic = await Music.findOne({
    $or: req.user
      ? [{ user: { $exists: false } }, { user: req.user.userId }]
      : [{ user: { $exists: false } }],
  })
    .skip(random)
    .limit(1);
  res.status(200).json(randomMusic);
};

// GET searched
const getSearchedMusic = async (req, res) => {
  const { nazwa } = req.params;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;
  let music;

  if (nazwa) {
    music = await Music.find({
      $or: req.user
        ? [{ user: { $exists: false } }, { user: req.user.userId }]
        : [{ user: { $exists: false } }],
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { author: { $regex: nazwa, $options: "i" } },
        { type: { $regex: nazwa, $options: "i" } },
      ],
    });
  } else {
    music = await Music.find({
      $or: req.user
        ? [{ user: { $exists: false } }, { user: req.user.userId }]
        : [{ user: { $exists: false } }],
    });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultMusic = music
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);
  const totalPages = Math.ceil(music.length / pageSize);

  res.status(200).json({
    music: resultMusic,
    allPages: totalPages,
  });
};

//GET by id
const getMusicById = async (req, res) => {
  const { id } = req.params;
  try {
    const music = await Music.findOne({ id: id });
    return res.status(200).json(music);
  } catch {
    return res.status(404).json({ message: "Music with given id not found" });
  }
};

//POST new
const createMusic = async (req, res) => {
  const { name, author, length, type, service, image } = req.body.music;
  const services = service.filter((x) => x.checked === true).map((x) => x.name);
  try {
    const music = await Music.create({
      name,
      user: req.user.userId,
      author,
      length,
      type,
      id: uuid(),
      service: services,
      image: image
        ? image
        : "https://ucarecdn.com/24cef946-d0f9-49a1-bca0-aaf9783cc685/d5bf4ba00a7a2ff69cf76b6c4e57c3e7.jpg",
    });
    res.status(201).json(music);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one
const deleteMusic = async (req, res) => {
  const { id } = req.params;

  await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $pull: { favouriteCombos: { musicId: id } } }
  );

  const user = await User.findOne({ _id: req.user.userId });
  const today = new Date().toJSON().slice(0, 10);
  const combo = user.dailyCombo.get(today);
  if (combo && combo.musicId === id) {
    await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $unset: { [`dailyCombo.${today}`]: "" } }
    );
  }

  const music = await Music.findOneAndDelete({ id: id });

  if (!music) {
    return res.status(400).json({ error: "This music not found!" });
  } else {
    res.status(200).json(music);
  }
};

//UPDATE one
const updateMusic = async (req, res) => {
  const { id } = req.params;

  const { image, service, ...rest } = req.body.music;
  const services = service.filter((x) => x.checked === true).map((x) => x.name);

  try {
    const music = await Music.findOneAndUpdate(
      { id: id },
      {
        ...rest,
        service: services,
        image: image
          ? image
          : "https://ucarecdn.com/24cef946-d0f9-49a1-bca0-aaf9783cc685/d5bf4ba00a7a2ff69cf76b6c4e57c3e7.jpg",
      }
    );
    res.status(201).json(music);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = {
  getMusic,
  getMusicById,
  createMusic,
  deleteMusic,
  updateMusic,
  getSearchedMusic,
  getRandomMusic,
};
