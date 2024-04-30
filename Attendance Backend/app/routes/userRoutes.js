const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../../middleware/authenticateUser');

// POST route for user login
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/verify-token', userController.verifyToken);
router.post('/punch-out', authenticateUser, userController.punchOut);
router.post('/punch-in', authenticateUser, userController.punchIn);
router.post('/request', userController.sendRequest); // Route for sending request
router.get('/requests/:team', userController.getRequest);
module.exports = router;
