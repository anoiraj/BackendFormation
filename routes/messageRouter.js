const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// CRUD
router.post('/createMessage', messageController.createMessage);
router.get('/getAllMessages', messageController.getAllMessages);
router.get('/getMessageById/:id', messageController.getMessageById);
router.put('/updateMessage/:id', messageController.updateMessage);
router.delete('/deleteMessage/:id', messageController.deleteMessage);

module.exports = router;
