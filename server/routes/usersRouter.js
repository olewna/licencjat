const express = require("express");
const { getUsers, createUser } = require("../controllers/userController.js");

const router = express.Router();

//GET all users
router.get("/", getUsers);

// POST new user
router.post("/", createUser);

module.exports = router;
