var ImageKit = require("imagekit")


var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLICKEY,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint: process.env.IMAGEKIT_URL,
})

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer,
            fileName: "cohort"
        }, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = uploadFile;