const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comboSchema = new Schema({
  foodId: {
    type: String,
    required: true,
  },
  gameId: {
    type: String,
    required: true,
  },
  musicId: {
    type: String,
    required: true,
  },
});

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    favouriteCombos: {
      type: [comboSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", usersSchema);
