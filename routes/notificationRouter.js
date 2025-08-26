const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// CRUD
router.post('/createNotification', notificationController.createNotification);
router.get('/getAllNotifications', notificationController.getAllNotifications);
router.get('/getNotificationById/:id', notificationController.getNotificationById);
router.put('/updateNotification/:id', notificationController.updateNotification);
router.delete('/deleteNotification/:id', notificationController.deleteNotification);

module.exports = router;
