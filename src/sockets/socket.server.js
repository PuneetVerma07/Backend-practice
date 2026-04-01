const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiService = require("../service/ai.service")
const messageModel = require("../models/message.model")

async function initSocketServer(httpServer) {

    const io = new Server(httpServer, { /* options */ });

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")

        if (!cookies.token) {
            next(new Error("Authentication Error: no Token provided"))
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)

            const user = await userModel.findById({ _id: decoded.id })

            socket.user = user;

            next();

        } catch (error) {
            next(new Error("Authentication Error : Invalid token"))
        }


    })

    io.on("connection", (socket) => {
        console.log("a user connected", socket.user)
        console.log("New Socket connectiong", socket.id)

        socket.on("ai-message", async (messagePayload) => {
            console.log(messagePayload)

            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            })

            const chatHistory = await messageModel.find({
                chat: messagePayload.chat
            })

            console.log("Chat History", chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))

            const response = await aiService.generateResponse(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{text: item.content}]
                }
            }))

            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            socket.emit("ai-response", {
                content: response,
                chat: messagePayload.chat
            })
        })
    });

}

module.exports = initSocketServer;

