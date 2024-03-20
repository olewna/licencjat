const User = require("../models/userModel");
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
    return res.status(400).json({ message: "Can't get combo for this user" });
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
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyToken,
  getTodayCombo,
  getUser,
  getUserById,
  registerUser,
  loginUser,
};
