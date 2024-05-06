const Chat = require("../models/chatModel");
const mongoose = require("mongoose");

function socketServer(sio) {
  sio.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      console.log("user disconnected");
    });

    socket.on("more", async (data) => {
      const dataInfo = JSON.parse(data);
      const fromToday = new Date();
      fromToday.setHours(0, 0, 0, 0);

      const getMsgs = await Chat.find({
        room: dataInfo.room,
        createdAt: { $lt: dataInfo.createdAt, $gte: fromToday.toISOString() },
      }).sort({ createdAt: -1 });

      socket.emit("isMore", JSON.stringify(getMsgs.length > 25));
      socket.emit("getMsgs", JSON.stringify(getMsgs.slice(0, 25)));
    });

    socket.on("join", async (msg) => {
      const message = JSON.parse(msg);
      socket.join(message.room);

      const fromToday = new Date();
      fromToday.setHours(0, 0, 0, 0);

      const getMsgs = await Chat.find({
        room: message.room,
        createdAt: { $gte: fromToday.toISOString() },
      }).sort({ createdAt: -1 });

      socket.emit("isMore", JSON.stringify(getMsgs.length > 25));
      socket.emit("getMsgs", JSON.stringify(getMsgs.slice(0, 25)));

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
