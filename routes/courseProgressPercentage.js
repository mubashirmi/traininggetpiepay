const express = require('express');
const { getCourseCompletionPercentage } = require('../controllers/courseProgressPercentageController');
const router = express.Router();

router.get('/courses/:courseId/progress/:userId', getCourseCompletionPercentage);

module.exports = router;