const initializeWebSockets = (wss) => {
  wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });

    ws.send("something");
  });
};

module.exports = initializeWebSockets;
