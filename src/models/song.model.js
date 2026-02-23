const mongooose = require("mongoose")

const songSchema = new mongooose.Schema({
    title: String,
    artist: String,
    url: String
})

const songModel = mongooose.model("song", songSchema)

module.exports = songModel;