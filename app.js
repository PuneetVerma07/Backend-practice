const http = require("http")

const server = http.createServer((req, res) => {
    res.end("Hello world from the server side")
});

server.listen(3000, () => {
    console.log("Server is running on port no.. 3000")
})