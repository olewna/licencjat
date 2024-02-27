const express = require("express");
const {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentController.js");

const router = express.Router();

//GET all comments
router.get("/", getComments);

// POST new comment
router.post("/", createComment);

// DELETE comment
router.delete("/:id", deleteComment);

// UPDATE comment
router.patch("/:id", updateComment);

module.exports = router;
