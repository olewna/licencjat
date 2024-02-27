const Food = require("../models/foodModel");
const mongoose = require("mongoose");

//GET all
const getFood = async (req, res) => {
  const food = await Food.find({});
  res.status(200).json(food);
};

//GET random
const getRandomFood = async (req, res) => {
  const count = await Food.countDocuments();
  const random = Math.floor(Math.random() * count);
  const randomFood = await Food.findOne().skip(random).limit(1);
  res.status(200).json(randomFood);
};

//GET searched
const getSearchedFood = async (req, res) => {
  const { nazwa } = req.params;

  if (/^[A-Za-z0-9]*$/.test(nazwa)) {
    const food = await Food.find({ name: { $regex: nazwa } });
    if (!food) {
      res.status(200).json({});
    } else {
      res.status(200).json(food);
    }
  }
};

//POST new
const createFood = async (req, res) => {
  const { name, telephone, id, company } = req.body;
  try {
    const food = await Food.create({ name, telephone, id, company });
    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one
const deleteFood = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "food not found!"})
  // }
  const food = await Food.findOneAndDelete({ id: id });

  if (!food) {
    return res.status(400).json({ error: "This food not found!" });
  } else {
    res.status(200).json(food);
  }
};

//UPDATE one
const updateFood = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "food not found!"})
  // }
  const food = await Food.findOneAndUpdate(
    { id: id },
    {
      ...req.body,
    }
  );

  if (!food) {
    return res.status(400).json({ error: "This food not found!" });
  } else {
    res.status(200).json(food);
  }
};

module.exports = {
  getFood,
  createFood,
  deleteFood,
  updateFood,
  getSearchedFood,
  getRandomFood,
};
