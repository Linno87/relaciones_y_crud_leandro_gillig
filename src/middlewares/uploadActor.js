const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, callback)=> {
    return callback(null, "./public/img/actors")
  },
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}_actors_${path.extname(file.originalname)}`)
  }
});

const uploadActors = multer({ storage });

module.exports = uploadActors;