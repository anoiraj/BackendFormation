const Team = require('../models/teamModel');
const User = require("../models/userModel");

// CREATE
module.exports.createTeam = async (req, res) => {
  try {
    const team = new Team(req.body);
    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
module.exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players").populate("matchId");
    res.status(200).json({teamsList:teams});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
module.exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players").populate("matchId");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
module.exports.updateTeam = async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeam) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
module.exports.deleteTeam = async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un joueur à une équipe
module.exports.addPlayerToTeam = async (req, res) => {
  try {
    const teamId = req.params.id; // ID de l’équipe dans params
    const { playerId } = req.body; // joueur dans body

    // Vérifier si l'équipe existe
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable" });
    }

    // Vérifier si le joueur existe
    const user = await User.findById(playerId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Mettre à jour l’équipe (éviter doublons avec $addToSet)
    await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { players: playerId } },
      { new: true }
    );

    // Mettre à jour l’utilisateur (ajouter la team dans son tableau)
    await User.findByIdAndUpdate(
      playerId,
      { $addToSet: { teams: teamId } },
      { new: true }
    );

    // Recharger la team avec joueurs peuplés
    const updatedTeam = await Team.findById(teamId).populate("players", "username email");

    res.status(200).json({
      message: "Joueur ajouté à l'équipe avec succès",
      team: updatedTeam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Retirer un joueur d’une équipe
module.exports.removePlayerFromTeam = async (req, res) => {
  try {
    const teamId = req.params.id; // 🔹 ID de l’équipe
    const { playerId } = req.body;

    const team = await Team.findByIdAndUpdate(
      teamId,
      { $pull: { players: playerId } },
      { new: true }
    ).populate("players", "username email");

    if (!team) return res.status(404).json({ message: "Équipe introuvable" });
    res.status(200).json({ message: "Joueur supprimé de l'équipe avec succès", team});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Afficher la composition d’une équipe
module.exports.getPlayersInTeam = async (req, res) => {
  try {
    const teamId = req.params.id; // 🔹 ID de l’équipe
    const team = await Team.findById(teamId).populate("players", "username age skillLevel preferredPosition");
    if (!team) return res.status(404).json({ message: "Équipe introuvable" });
    res.status(200).json(team.players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les équipes d’un match
module.exports.getTeamsByMatch = async (req, res) => {
  try {
    const matchId = req.params.id; // 🔹 ID du match
    const teams = await Team.find({ match: matchId }).populate("players", "username email");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};