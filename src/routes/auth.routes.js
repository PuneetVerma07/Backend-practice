const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.create({
        username, password
    })

    const token = jwt.sign({
        id : user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "user created successfully",
        user
    })
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({
        username: username,
    })

    if (!user) {
        return res.status(401).json({
            message:"user not found [invalid username]"
        })
    }

    const isValidPassword = password == user.password;

    if (!isValidPassword) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

    res.status(200).json({
        message: "user fetched successfully",
        user
    })
})

router.get("/user", async (req, res) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({
            _id: decoded.id
        }).select("-password -__v")

    } catch (err) {
        res.status(401).json({
            message:"Unauthorized [invalid user]"
        })
    }
})

module.exports = router;