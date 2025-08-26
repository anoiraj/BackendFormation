const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/createTeam', teamController.createTeam);
router.get('/getAllTeams', teamController.getAllTeams);
router.get('/getTeamById/:id', teamController.getTeamById);
router.put('/updateTeam/:id', teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);

module.exports = router;
