const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("connected to DB")
    } catch (error) {
        console.error("Error while connecting to DB")
    }
}

module.exports = connectDB;