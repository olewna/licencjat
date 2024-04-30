const Chat = require("../models/chatModel");
const mongoose = require("mongoose");

const getChatMessages = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  const music = await Music.find({});

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultMusic = music
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    })
    .slice(startIndex, endIndex);

  const totalPages = Math.ceil(music.length / pageSize);
  res.status(200).json({ music: resultMusic, allPages: totalPages });
};

function socketServer(sio) {
  sio.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      console.log("user disconnected");
    });

    socket.on("join", async (msg) => {
      const message = JSON.parse(msg);
      socket.join(message.room);

      const fromToday = new Date();
      // fromToday.setDate(fromToday.getDate() - 2);
      fromToday.setHours(0, 0, 0, 0);
      const getMsgs = await Chat.find({
        room: message.room,
        createdAt: { $gte: fromToday.toISOString() },
      })
        .sort({ createdAt: -1 })
        .limit(25);
      socket.emit("getMsgs", JSON.stringify(getMsgs));

      const chatMsg = await Chat.create({
        author: "",
        room: message.room,
        message: `${message.author} ${message.message}`,
        createdAt: new Date().toISOString(),
      });
      socket.nsp.to(message.room).emit("info", JSON.stringify(chatMsg));
    });

    socket.on("leave", async (msg) => {
      const message = JSON.parse(msg);

      const chatMsg = await Chat.create({
        author: "",
        room: message.room,
        message: `${message.author} ${message.message}`,
        createdAt: new Date().toISOString(),
      });
      socket.to(message.room).emit("info", JSON.stringify(chatMsg));
      socket.leave(message.room);
    });

    socket.on("msg", async (msg) => {
      const message = JSON.parse(msg);
      const chatMsg = await Chat.create({
        author: message.author,
        room: message.room,
        message: message.message,
        createdAt: new Date().toISOString(),
      });
      socket.nsp.to(message.room).emit("newMsg", JSON.stringify(chatMsg));
    });
  });
}

module.exports = {
  socketServer,
};
