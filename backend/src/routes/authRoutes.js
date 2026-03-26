/**
 * Auth Routes
 */
const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/change-password', authMiddleware, AuthController.changePassword);
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
