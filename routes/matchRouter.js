const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/createMatch', matchController.createMatch);
router.get('/getAllMatches', matchController.getAllMatches);
router.get('/getMatchById/:id', matchController.getMatchById);
router.put('/updateMatch/:id', matchController.updateMatch);
router.delete('/deleteMatch/:id', matchController.deleteMatch);

module.exports = router;
