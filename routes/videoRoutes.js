const express = require('express');
const { getVideoFile } = require('../controllers/videoController');
const router = express.Router();

router.get('/courses/:courseId/parts/:partId/videos/:videoId', getVideoFile);

module.exports = router;
