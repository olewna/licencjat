function socketServer(sio) {
  sio.on("connection", async (socket) => {
    console.log("nowe połączenie");
    // console.log(socket);

    socket.on("disconnect", async () => {
      console.log("user disconnected");
    });

    socket.on("join", async (msg) => {
      const message = JSON.parse(msg);
      socket.join(message.room);
      socket.nsp
        .to(message.room)
        .emit("info", `${message.author} ${message.message}`);
    });

    socket.on("leave", async (msg) => {
      const message = JSON.parse(msg);
      socket.nsp
        .to(message.room)
        .emit("info", `${message.author} ${message.message}`);
      socket.leave(message.room);
    });

    try {
      socket.on("msg", async (msg) => {
        const message = JSON.parse(msg);
        socket.nsp
          .to(message.room)
          .emit(
            "newMsg",
            JSON.stringify({ author: message.author, message: message.message })
          );
      });
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = {
  socketServer,
};
