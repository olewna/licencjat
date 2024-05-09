const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Games = require("../models/gamesModel");
const Food = require("../models/foodModel");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const secret = "si3m5s0NXD";

const verifyToken = (req, res, next) => {
  const jwtToken = req.headers["authorization"];

  if (typeof jwtToken !== "undefined") {
    jwt.verify(jwtToken, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json(err);
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401);
  }
};

//GET all users
const getUser = async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user.userId });
  res.status(200).json(currentUser);
};

//GET by id
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUser = await User.findOne({ _id: userId });
    return res.status(200).json(currentUser);
  } catch (err) {
    return res.status(404).json({ message: "User not found" });
  }
};

// GET today combo
const getTodayCombo = async (req, res) => {
  const userId = req.params.id;
  const today = new Date().toJSON().slice(0, 10);
  try {
    const currentUser = await User.findOne({ _id: userId });
    const dailyCombo = currentUser.dailyCombo.get(today);
    return res.status(200).json(dailyCombo);
  } catch (err) {
    return res.status(404).json({ message: "Can't get combo for this user" });
  }
};

// POST add combo to user
const addComboToUser = async (req, res) => {
  const userId = req.params.id;
  const today = new Date().toJSON().slice(0, 10);
  const combo = req.body;
  try {
    const currentUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { [`dailyCombo.${today}`]: combo } },
      { upsert: true, new: true }
    );
    const dailyCombo = currentUser.dailyCombo.get(today);
    return res.status(201).json(dailyCombo);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error while adding combo to user" });
  }
};

// PUt check if combo is favourite
const checkIfComboFavourite = async (req, res) => {
  const userId = req.params.id;
  const combo = req.body;
  try {
    const currentUser = await User.findOne({ _id: userId });
    const isFav = currentUser.favouriteCombos.find((obj) => {
      return (
        obj.foodId === combo.foodId &&
        obj.gameId === combo.gameId &&
        obj.musicId === combo.musicId
      );
    });
    if (isFav) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error occured while checking favourite combo" });
  }
};

// POST add combo to favourite
const addComboToFavourite = async (req, res) => {
  const userId = req.params.id;
  const combo = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favouriteCombos: combo } }
    );
    return res.status(201).json(combo);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error while adding combo to user's favourites" });
  }
};

// DELETE delete combo from favourite
const deleteComboFromFavourite = async (req, res) => {
  const userId = req.params.id;
  const combo = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favouriteCombos: combo } }
    );
    return res.status(201).json(combo);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error while deleting combo from user's favourites" });
  }
};

// PUT update combo with new element
const updateComboWithOneElement = async (req, res) => {
  const userId = req.params.id;
  const today = new Date().toJSON().slice(0, 10);
  const { type, id } = req.body;
  try {
    const currentUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { [`dailyCombo.${today}.${type}Id`]: id } }
    );
    const dailyCombo = currentUser.dailyCombo.get(today);
    return res.status(200).json(dailyCombo);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error while updating single element of combo" });
  }
};

//POST login user
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = sha256(password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const userToken = jwt.sign({ userId: user._id, name: user.name }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ userToken, user });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST register user
const registerUser = async (req, res) => {
  const { name, type, password, email, image } = req.body;
  const hashed_password = sha256(password);

  try {
    const existingUserByName = await User.findOne({ name });
    if (existingUserByName) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = await User.create({
      name,
      type,
      password: hashed_password,
      email,
      image: image || "",
      favouriteCombos: [],
      dailyCombo: {},
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const music = await Music.deleteMany({ user: userId });
    const food = await Food.deleteMany({ owner: userId });
    const games = await Games.deleteMany({ author: userId });
    const deleted = music.deletedCount + food.deletedCount + games.deletedCount;

    const userToDelete = await User.findOneAndDelete({ _id: userId });
    res.status(200).json(`Deleted ${deleted} elements with account`);
  } catch (err) {
    res.status(400).json({ error: "User not found" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;

  const { image, password, email, name } = req.body.user;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        image: image ? image : "",
        password: sha256(password),
        email,
        name,
      }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  verifyToken,
  getTodayCombo,
  addComboToFavourite,
  deleteComboFromFavourite,
  updateComboWithOneElement,
  checkIfComboFavourite,
  getUser,
  getUserById,
  addComboToUser,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
};
