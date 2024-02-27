const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
} = require("../controllers/userController.js");

const router = express.Router();

//GET all users
router.get("/", getUsers);

//GET logged user
router.get("/login", getUser);

// POST new user
router.post("/", createUser);

module.exports = router;
