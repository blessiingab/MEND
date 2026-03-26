/**
 * Assessment Routes
 */
const express = require('express');
const AssessmentController = require('../controllers/AssessmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/phq9', authMiddleware, AssessmentController.submitPHQ9);
router.post('/gad7', authMiddleware, AssessmentController.submitGAD7);
router.get('/history', authMiddleware, AssessmentController.getAssessmentHistory);
router.get('/stats', authMiddleware, AssessmentController.getAssessmentStats);
router.get('/latest/:type', authMiddleware, AssessmentController.getLatestAssessment);

module.exports = router;
