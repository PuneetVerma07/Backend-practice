const chatModel = require("../models/chat.model")

async function createChat(req, res) {
    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user.id,
        title
    })

    res.status(201).json({
        "message": 'chat created successfully',
        chat: {
            id: chat.id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    })
}

module.exports = { createChat }