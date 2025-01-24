const express = require('express');
const { getAssessmentQuestions, submitAssessment } = require('../controllers/assesmentController');
const router = express.Router();

router.get('/parts/:partId/assessment', getAssessmentQuestions);
router.post('/assessments/:assessmentId/submit', submitAssessment);

module.exports = router;
