const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gamesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    multiplayer: {
      type: Boolean,
      required: true,
    },
    singleplayer: {
      type: Boolean,
      required: true,
    },
    logoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Games", gamesSchema);
