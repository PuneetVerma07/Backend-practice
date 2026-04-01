const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const chatController = require("../controllers/chat.controllers")


const router = express.Router();

router.post("/", authMiddleware.authUser, chatController.createChat)

module.exports = router;