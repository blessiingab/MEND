/**
 * Therapy Session Routes
 */
const express = require('express');
const SessionController = require('../controllers/SessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/book', authMiddleware, SessionController.bookSession);
router.get('/my-sessions', authMiddleware, SessionController.getUserSessions);
router.get('/available-therapists', authMiddleware, SessionController.getAvailableTherapists);
router.get('/stats', authMiddleware, SessionController.getSessionStats);
router.get('/:sessionId', authMiddleware, SessionController.getSessionById);
router.put('/:sessionId', authMiddleware, SessionController.updateSession);
router.put('/:sessionId/cancel', authMiddleware, SessionController.cancelSession);

module.exports = router;
