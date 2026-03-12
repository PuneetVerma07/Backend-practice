const express = require("express")
const userModel = require("../model/user.model")
const jwt = require("jsonwebtoken")

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await userModel.findOne({
        username
    })

    if (existingUser) {
        return res.status(409).json({
            message: "username already exists"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    const user = await userModel.create({
        username, password
    })

    res.status(201).json({
        message: "user created sucessfully",
        user
    })
})

module.exports = router