const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
});

const uploadStorage = multer({ storage: storage });

module.exports = {uploadStorage}