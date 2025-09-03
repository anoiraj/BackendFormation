const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const {requireAuthUser} = require("../middlewares/authMiddlewares")

router.use(requireAuthUser) //temchi al kol

router.post('/createMatch', matchController.createMatch);
router.get('/getAllMatches', matchController.getAllMatches);
router.get('/getMatchById/:id', matchController.getMatchById);
router.put('/updateMatch/:id', matchController.updateMatch);
router.delete('/deleteMatch/:id', matchController.deleteMatch);
router.post('/addMatchWithPlayer', matchController.addMatchWithPlayer);
router.post('/addPlayerToMatch', matchController.addPlayerToMatch);
router.put('/removePlayerFromMatch', matchController.removePlayerFromMatch);
router.get('/getPlayersInMatch/:id', matchController.getPlayersInMatch);
router.get('/getMatchesByPlayer/:id', matchController.getMatchesByPlayer);
router.get('/getUpcomingMatches', matchController.getUpcomingMatches);



module.exports = router;
