/**
 * Admin Routes
 */
const express = require('express');
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/users', AdminController.getAllUsers);
router.get('/users/:userId', AdminController.getUserDetails);
router.delete('/users/:userId', AdminController.deleteUser);
router.get('/assessments/stats', AdminController.getAssessmentStats);
router.get('/sessions/stats', AdminController.getSessionStats);
router.get('/posts/stats', AdminController.getPostStats);
router.post('/moderate-content', AdminController.moderateContent);
router.get('/engagement/metrics', AdminController.getUserEngagementMetrics);

module.exports = router;
