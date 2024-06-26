const Food = require("../models/foodModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

//GET all
const getFood = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  let food;
  if (req.user) {
    food = await Food.find({
      $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
    });
  } else {
    food = await Food.find({ owner: { $exists: false } });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultFood = food
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);

  const totalPages = Math.ceil(food.length / pageSize);
  res.status(200).json({ food: resultFood, allPages: totalPages });
};

//GET random
const getRandomFood = async (req, res) => {
  const { vegetarian } = req.query;
  if (req.user) {
    const count =
      vegetarian === "true"
        ? await Food.find({
            $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
            vegetarian: vegetarian,
          })
        : await Food.find({
            $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
          });
    const random = Math.floor(Math.random() * count.length);
    const randomFood =
      vegetarian === "true"
        ? await Food.findOne({
            $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
            vegetarian: vegetarian,
          })
            .skip(random)
            .limit(1)
        : await Food.findOne({
            $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
          })
            .skip(random)
            .limit(1);
    return res.status(200).json(randomFood);
  } else {
    const count =
      vegetarian === "true"
        ? await Food.find({
            owner: { $exists: false },
            vegetarian: vegetarian,
          })
        : await Food.find({ owner: { $exists: false } });
    const random = Math.floor(Math.random() * count.length);
    const randomFood =
      vegetarian === "true"
        ? await Food.findOne({
            owner: { $exists: false },
            vegetarian: vegetarian,
          })
            .skip(random)
            .limit(1)
        : await Food.findOne({ owner: { $exists: false } })
            .skip(random)
            .limit(1);
    return res.status(200).json(randomFood);
  }
};

//GET by id
const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findOne({ id: id });
    return res.status(200).json(food);
  } catch {
    return res.status(404).json({ message: "Food with given id not found" });
  }
};

//GET searched
const getSearchedFood = async (req, res) => {
  const { nazwa } = req.params;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;
  let food;

  if (req.user) {
    food = await Food.find({
      $or: [{ owner: { $exists: false } }, { owner: req.user.userId }],
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { company: { $regex: nazwa, $options: "i" } },
      ],
    });
  } else {
    food = await Food.find({
      owner: { $exists: false },
      $or: [
        { name: { $regex: nazwa, $options: "i" } },
        { company: { $regex: nazwa, $options: "i" } },
      ],
    });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultFood = food
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);
  const totalPages = Math.ceil(food.length / pageSize);

  res.status(200).json({
    food: resultFood,
    allPages: totalPages,
  });
};

//POST new
const createFood = async (req, res) => {
  try {
    const { name, telephone, company, owner, vegetarian, image } =
      req.body.food;
    if (owner) {
      const food = await Food.create({
        name,
        id: uuid(),
        owner: req.user.userId,
        vegetarian,
        image: image
          ? image
          : "https://ucarecdn.com/372b11d4-fa5d-4b61-bad0-04e8ff495dff/pngtreerestauranticonvectorpngimage_5045307.jpg",
      });
      return res.status(201).json(food);
    } else {
      const food = await Food.create({
        name,
        company,
        id: uuid(),
        owner: req.user.userId,
        telephone,
        vegetarian,
        image: image
          ? image
          : "https://ucarecdn.com/372b11d4-fa5d-4b61-bad0-04e8ff495dff/pngtreerestauranticonvectorpngimage_5045307.jpg",
      });
      return res.status(201).json(food);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//DELETE one
const deleteFood = async (req, res) => {
  const { id } = req.params;

  await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $pull: { favouriteCombos: { foodId: id } } }
  );

  const user = await User.findOne({ _id: req.user.userId });
  const today = new Date().toJSON().slice(0, 10);
  const combo = user.dailyCombo.get(today);
  if (combo && combo.foodId === id) {
    await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $unset: { [`dailyCombo.${today}`]: "" } }
    );
  }

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

  const { image, owner, ...rest } = req.body.food;

  try {
    let food;
    if (owner) {
      food = await Food.findOneAndUpdate(
        { id: id },
        {
          ...rest,
          image: image
            ? image
            : "https://ucarecdn.com/372b11d4-fa5d-4b61-bad0-04e8ff495dff/pngtreerestauranticonvectorpngimage_5045307.jpg",
          $unset: {
            company: "",
            telephone: "",
          },
        }
      );
    } else {
      food = await Food.findOneAndUpdate(
        { id: id },
        {
          ...rest,
          image: image
            ? image
            : "https://ucarecdn.com/372b11d4-fa5d-4b61-bad0-04e8ff495dff/pngtreerestauranticonvectorpngimage_5045307.jpg",
        }
      );
    }
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = {
  getFood,
  getFoodById,
  createFood,
  deleteFood,
  updateFood,
  getSearchedFood,
  getRandomFood,
};
