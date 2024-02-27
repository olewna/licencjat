const User = require("../models/userModel");
const sha256 = require("js-sha256");

//GET all users
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

//POST create user
const createUser = async (req, res) => {
  const { name, type, password, email } = req.body;
  const hashed_password = sha256(password);
  try {
    const user = await User.create({ name, type, hashed_password, email });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
};
