const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const router = express.Router();

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    // Cloudinary returns the secure_url in req.file.path
    res.send(req.file.path);
});

module.exports = router;
