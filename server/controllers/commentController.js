const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

//GET all
const getComments = async (req, res) => {
  const comments = await Comment.find({});
  res.status(200).json(comments);
};

//POST new
const createComment = async (req, res) => {
  const { name, content, id } = req.body;
  try {
    const comment = await Comment.create({ name, content, id });
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one
const deleteComment = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "Comment not found!"})
  // }
  const comment = await Comment.findOneAndDelete({ id: id });

  if (!comment) {
    return res.status(400).json({ error: "Comment not found!" });
  } else {
    res.status(200).json(comment);
  }
};

//UPDATE one
const updateComment = async (req, res) => {
  const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)){
  //     return res.status(404).json({error: "Comment not found!"})
  // }
  const comment = await Comment.findOneAndUpdate(
    { id: id },
    {
      ...req.body,
    }
  );

  if (!comment) {
    return res.status(400).json({ error: "Comment not found!" });
  } else {
    res.status(200).json(comment);
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
