const express = require('express');
const { updateVideoProgress, getVideoProgress } = require('../controllers/videoProgressController');
const router = express.Router();

// Update video progress
router.put('/videos/:videoId/progress/:userId', updateVideoProgress);

// Get video progress
router.get('/videos/:videoId/progress/:userId', getVideoProgress);

module.exports = router;
