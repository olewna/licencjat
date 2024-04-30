const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
  },
  room: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
