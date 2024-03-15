const Music = require("../models/musicModel");
const mongoose = require("mongoose");

//GET all
const getMusic = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  const music = await Music.find({});

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
  const count = await Music.countDocuments();
  const random = Math.floor(Math.random() * count);
  const randomMusic = await Music.findOne().skip(random).limit(1);
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
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { author: { $regex: nazwa, $options: "i" } },
        { type: { $regex: nazwa, $options: "i" } },
      ],
    });
  } else {
    music = await Music.find({});
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

//POST new
const createMusic = async (req, res) => {
  const { name, author, length, type, id } = req.body;
  try {
    const music = await Music.create({ name, author, length, type, id });
    res.status(200).json(music);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one
const deleteMusic = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "food not found!"})
  // }
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
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "food not found!"})
  // }
  const music = await Music.findOneAndUpdate(
    { id: id },
    {
      ...req.body,
    }
  );

  if (!music) {
    return res.status(400).json({ error: "This music not found!" });
  } else {
    res.status(200).json(music);
  }
};

module.exports = {
  getMusic,
  createMusic,
  deleteMusic,
  updateMusic,
  getSearchedMusic,
  getRandomMusic,
};
