const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const {requireAuthUser} = require("../middlewares/authMiddlewares")


router.use(requireAuthUser)

// CRUD
router.post('/createNotification', notificationController.createNotification);
router.get('/getAllNotifications', notificationController.getAllNotifications);
router.get('/getNotificationById/:id', notificationController.getNotificationById);
router.put('/updateNotification/:id', notificationController.updateNotification);
router.delete('/deleteNotification/:id', notificationController.deleteNotification);
router.get("/getNotificationsByUser/:id", notificationController.getNotificationsByUser);
router.put("/markNotificationAsRead/:id", notificationController.markNotificationAsRead);
router.put("/markAllAsRead/:id", notificationController.markAllAsRead);

module.exports = router;
