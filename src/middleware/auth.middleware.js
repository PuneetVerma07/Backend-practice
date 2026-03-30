const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authUser(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(400).json({ "message": "unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById({ _id: decoded.id })

        req.user = user;

        next()
    } catch (error) {
        console.error("Error while user authorization")
    }
}

module.exports = { authUser }