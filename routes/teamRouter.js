const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const {requireAuthUser} = require("../middlewares/authMiddlewares")


router.use(requireAuthUser)

router.post('/createTeam', teamController.createTeam);
router.get('/getAllTeams', teamController.getAllTeams);
router.get('/getTeamById/:id', teamController.getTeamById);
router.put('/updateTeam/:id', teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);
router.post("/addPlayerToTeam/:id", teamController.addPlayerToTeam);
router.put("/removePlayerFromTeam/:id", teamController.removePlayerFromTeam);
router.get("/getPlayersInTeam/:id", teamController.getPlayersInTeam);
router.get("/getTeamsByMatch/:id", teamController.getTeamsByMatch);


module.exports = router;
