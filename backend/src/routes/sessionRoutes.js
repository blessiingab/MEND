/**
 * Therapy Session Routes
 */
const express = require('express');
const SessionController = require('../controllers/SessionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/book', authMiddleware, SessionController.bookSession);
router.get('/my-sessions', authMiddleware, SessionController.getUserSessions);
router.get('/therapist-sessions', authMiddleware, SessionController.getTherapistSessions);
router.get('/available-therapists', authMiddleware, SessionController.getAvailableTherapists);
router.get('/stats', authMiddleware, SessionController.getSessionStats);
router.post('/groups', authMiddleware, roleMiddleware('therapist'), SessionController.createTherapistGroup);
router.get('/groups', authMiddleware, roleMiddleware('therapist'), SessionController.getTherapistGroups);
router.post('/groups/:groupId/members', authMiddleware, roleMiddleware('therapist'), SessionController.addMemberToTherapistGroup);
router.delete('/groups/:groupId/members/:userId', authMiddleware, roleMiddleware('therapist'), SessionController.removeMemberFromTherapistGroup);
router.get('/therapist-clients', authMiddleware, roleMiddleware('therapist'), SessionController.getTherapistAvailableClients);
router.get('/:sessionId', authMiddleware, SessionController.getSessionById);
router.put('/:sessionId', authMiddleware, SessionController.updateSession);
router.put('/:sessionId/cancel', authMiddleware, SessionController.cancelSession);

module.exports = router;
