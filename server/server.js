const express = require("express");
const cors = require("cors");
require("dotenv").config();
const foodRoutes = require("./routes/foodRouter.js");
const musicRoutes = require("./routes/musicRouter");
const gamesRoutes = require("./routes/gamesRouter");
const userRoutes = require("./routes/usersRouter");

const mongoose = require("mongoose");
const port = process.env.PORT || 4000;

//express app
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/food", foodRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/users", userRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listener
    app.listen(port, () => {
      console.log("working on port " + port);
    });
  })
  .catch((err) => {
    console.log("connection error");
    console.log(err);
  });
