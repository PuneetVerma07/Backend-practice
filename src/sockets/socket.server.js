
const { Server } = require("socket.io");


async function initSocketServer(httpServer) {
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
        console.log("New Socket Connection", socket.id)

    });
}

module.exports = initSocketServer;
