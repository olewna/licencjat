const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      // required: true,
    },
    company: {
      type: String,
      // required: true,
    },
    id: {
      type: String,
      required: true,
    },
    vegetarian: {
      type: Boolean,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
