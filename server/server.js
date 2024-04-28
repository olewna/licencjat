const express = require("express");
const cors = require("cors");
require("dotenv").config();
const foodRoutes = require("./routes/foodRouter.js");
const musicRoutes = require("./routes/musicRouter");
const gamesRoutes = require("./routes/gamesRouter");
const userRoutes = require("./routes/usersRouter");
const jwt = require("jsonwebtoken");
const secret = "si3m5s0NXD";
const { socketServer } = require("./controllers/socketController.js");

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

const checkIfUserIsLogged = (req, res, next) => {
  const jwtToken = req.headers["authorization"];

  if (typeof jwtToken !== "undefined") {
    jwt.verify(jwtToken, secret, (err, decoded) => {
      req.user = decoded;
    });
  }
  next();
};

const server = require("http").createServer(app);
const sio = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketServer(sio);

app.use(checkIfUserIsLogged);

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
    server.listen(port, () => {
      console.log("working on port " + port);
    });
  })
  .catch((err) => {
    console.log("connection error");
    console.log(err);
  });
