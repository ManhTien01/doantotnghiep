const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo folder nếu chưa tồn tại
const uploadPath = path.join(__dirname, "../../pos_prontend/public/images/menu");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
