const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for adding a new user
router.post('/create', adminController.createUser);
router.get('/users/:team/:month/:year', adminController.getAllUsers);
router.get('/teams/:team/:month/:year', adminController.getUsersByTeam);
router.get('/users/:userId', adminController.getUserById);
// Route for updating user information
router.put('/users/:userId', adminController.updateUser);
// Route for deleting a user
router.delete('/users/:userId', adminController.deleteUser);
router.get('/attendance/current-day', adminController.getUserAttendanceCurrentDay);
router.post('/announcement', adminController.sendAnnouncement); // Route for sending annoucemenets
router.get('/announcements/:team', adminController.getAnnouncements); // Route for sending annoucemenets
router.get('/teams', adminController.getAllTeams); // Route for sending annoucemenets
router.get('/download-attendance', adminController.downloadAttendance)
router.post('/register', adminController.registerAdmin); // Route for registering Admin
router.post('/login', adminController.loginAdmin); // Route for registering Admin
router.get('/requests', adminController.getAllRequests);
router.put('/request/:requestId', adminController.updateRequest);



module.exports = router;