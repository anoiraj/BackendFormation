const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {requireAuthUser} = require("../middlewares/authMiddlewares")


router.use(requireAuthUser)
// CRUD
router.post('/createMessage', messageController.createMessage);
router.get('/getAllMessages', messageController.getAllMessages);
router.get('/getMessageById/:id', messageController.getMessageById);
router.put('/updateMessage/:id', messageController.updateMessage);
router.delete('/deleteMessage/:id', messageController.deleteMessage);
router.get("/getMessagesByMatch/:id", messageController.getMessagesByMatch);
router.get("/getMessagesByUser/:id", messageController.getMessagesByUser);

module.exports = router;
