const express = require("express")

const app = express();

app.use("/", (req, res) => {
    res.send("hellow world!")
})

module.exports = app;