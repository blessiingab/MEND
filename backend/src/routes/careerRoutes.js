/**
 * Career Guidance Routes
 */
const express = require('express');
const CareerController = require('../controllers/CareerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/guidance', authMiddleware, CareerController.createGuidanceSession);
router.get('/my-path', authMiddleware, CareerController.getUserCareerPath);
router.get('/history', authMiddleware, CareerController.getUserCareerHistory);
router.get('/resources', CareerController.getCareerResources);
router.post('/progress', authMiddleware, CareerController.trackProgress);
router.get('/progress/tracking', authMiddleware, CareerController.getProgressTracking);
router.post('/resources/create', authMiddleware, CareerController.createResource);

module.exports = router;
