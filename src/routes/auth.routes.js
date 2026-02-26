const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const isUserExists = await userModel.findOne({
        username
    })

    if (isUserExists) {
        return res.status(409).json({
            message: "username already used"
        })
    }

    const user = await userModel.create({username, password})
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    res.status(201).json({
        message: "user created successfully", 
        user
    })
})

router.get("/user", async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized token not found"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({
            _id: decoded.id
        })

        res.status(200).json({
            message: "user fetched successfully",
            user
        })

    } catch (error) {
        return res.status(401).json({
            message: "unauthorized invalid token"
        })
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({username})

    if (!user) {
        return res.status(401).json({
            message: "user cannot found"
        })
    }

    const isValidPassword = user.password === password;

    if (!isValidPassword) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60* 1000)
    })

    res.status(201).json({
        message: "user loggedIn successfully",
        user
    })
})

router.get("/logout", async (req, res) => {
    res.clearCookie("token")

    res.status(200).json({
        message: "user loggedout successfully"
    })
})



module.exports = router;