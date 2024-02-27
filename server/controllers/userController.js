const User = require("../models/userModel");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");

//GET all users
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

//GET user
const getUser = async (req, res) => {
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

    const userToken = jwt.sign(
      { userId: user._id, username: user.name },
      "si3m5s0NXD",
      { expiresIn: "1h" }
    );

    res.status(200).json({ userToken, user });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST create user
const createUser = async (req, res) => {
  const { name, type, password, email } = req.body;
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

    const newUser = await User.create({ name, type, hashed_password, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
