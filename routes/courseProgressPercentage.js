const express = require('express');
const { getDetailedCourseProgress } = require('../controllers/courseProgressPercentageController');
const router = express.Router();
router.get('/courses/:courseId/progress/:userId', getDetailedCourseProgress);
module.exports = router;