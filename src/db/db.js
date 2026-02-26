const mongoose = require("mongoose")

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log("error connecting to db", err))
}

module.exports = connectToDB;