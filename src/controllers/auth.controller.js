const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerController(req, res) {
    const { username, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({username})

    if (isUserAlreadyExists) {
        return res.status(400).json({message:"username already exists"})
    }

    const user = await userModel.create({
        username,
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: 'user registered sucessfully',
        user: {
            username: user.username,
            userId: user._id
        }
    })


}

async function loginController(req, res) {
    const { username, password } = req.body;

    const user = await userModel.findOne({username})

    if (!user) {
        return res.status(400).json({message: 'username not found'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({message: "Invalid password"})
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(200).json({
        message: "user loggedIn sucessfully",
        user: {
            username: user.username,
            usesId: user._id
        }
    })
}

module.exports = {registerController, loginController}