let multer = require("multer");
const path = require("path");
let storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/video"));
  },
  filename: async function (req, file, cb) {
    const filename = path.parse(file.originalname).name;
    cb(null, Date.now() + "-" + filename + path.extname(file.originalname));
  },
});
module.exports = multer({
  storage: storage,
  dest: path.join(__dirname, "../../public/video"),
});
