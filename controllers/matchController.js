const Match = require("../models/matchModel");

module.exports.createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    const savedMatch = await match.save();
    res.status(200).json(savedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json({matchesList : matches});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateMatch = async (req, res) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMatch) return res.status(404).json({ message: "Match not found" });
    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteMatch = async (req, res) => {
  try {
    const deleted = await Match.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Match not found" });
    res.status(200).json({ message: "Match deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require("../models/userModel");

// Ajouter un match avec des joueurs
module.exports.addMatchWithPlayer = async (req, res) => {
  try {
    const { title, date, location, maxPlayers, organizerId, status, players } = req.body;
    const newMatch = new Match({ title, date, location, maxPlayers, organizerId, status, players})

    // Vérifier l'organisateur
    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organisateur introuvable" });
    }

    // Vérifier que les joueurs existent
    if (players && players.length > 0) {
      for (let playerId of players) {
        const player = await User.findById(playerId);
        if (!player) {
          return res.status(404).json({ message: `Joueur avec ID ${playerId} introuvable` });
        }
      }
    }

    // Vérifier la limite maxPlayers
    if (players && maxPlayers && players.length > maxPlayers) {
      return res.status(400).json({ message: "Nombre de joueurs supérieur à maxPlayers" });
    }

    // Créer le match
    const savedMatch = await newMatch.save();

    // Mettre à jour la liste de matchs des joueurs
    if (players && players.length > 0) {
      await User.updateMany(
        { _id: { $in: players } },
        { $push: { matches: savedMatch._id } }
      );
    }

    // Mettre à jour la liste de matchs de l’organisateur
    await User.findByIdAndUpdate(
      organizerId,
      { $push: { matches: savedMatch._id } }
    );


    res.status(201).json({ message: "Match créé avec succès", match: savedMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un joueur à un match existant
module.exports.addPlayerToMatch = async (req, res) => {
  try {
    const { matchId, playerId } = req.body;

    // Vérifier que le match existe
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match introuvable" });
    }

    // Vérifier que le joueur existe
    const player = await User.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur introuvable" });
    }

    // Vérifier si le joueur est déjà dans le match
    if (match.players.includes(playerId)) {
      return res.status(400).json({ message: "Joueur déjà inscrit dans ce match" });
    }

    // Vérifier la limite maxPlayers
    if (match.players.length >= match.maxPlayers) {
      return res.status(400).json({ message: "Ce match est déjà complet" });
    }

    // Ajouter le joueur dans le match
    match.players.push(playerId);
    const updatedMatch = await match.save();

    // Ajouter le match dans le profil du joueur
    await User.findByIdAndUpdate(
      playerId,
      { $push: { matches: match._id } }
    );

    res.status(200).json({ message: "Joueur ajouté au match avec succès", match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retirer un joueur d'un match
module.exports.removePlayerFromMatch = async (req, res) => {
  try {
    const { matchId, playerId } = req.body;

    // Vérifier que le match existe
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match introuvable" });
    }

    // Vérifier que le joueur existe
    const player = await User.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur introuvable" });
    }

    // Vérifier si le joueur est dans le match
    if (!match.players.includes(playerId)) {
      return res.status(400).json({ message: "Ce joueur n'est pas inscrit à ce match" });
    }

    // Supprimer le joueur du match
    match.players = match.players.filter(p => p.toString() !== playerId);
    const updatedMatch = await match.save();

    // Supprimer le match de la liste du joueur
    await User.findByIdAndUpdate(
      playerId,
      { $pull: { matches: match._id } }
    );

    res.status(200).json({ message: "Joueur retiré du match avec succès", match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les joueurs d'un match
module.exports.getPlayersInMatch = async (req, res) => {
  try {
    // Chercher le match et peupler les joueurs
    const match = await Match.findById(req.params.id).populate(
      "players",
      "username email age skillLevel preferredPosition"
    );

    if (!match) {
      return res.status(404).json({ message: "Match introuvable" });
    }

    res.status(200).json({ players: match.players });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les matchs auxquels un joueur participe
module.exports.getMatchesByPlayer = async (req, res) => {
  try {

    // Vérifier si le joueur existe + peupler ses matchs
    const player = await User.findById(req.params.id).populate(
      "matches",
      "title date location status maxPlayers"
    );

    if (!player) {
      return res.status(404).json({ message: "Joueur introuvable" });
    }

    res.status(200).json({ matches: player.matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les matchs à venir
module.exports.getUpcomingMatches = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd (comme ton champ date est String)

    const matches = await Match.find({
      date: { $gte: today },       // matchs dont la date >= aujourd'hui
      status: "Scheduled"          // seulement les matchs programmés
    }).sort({ date: 1 });          // tri ascendant par date

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "Aucun match à venir trouvé" });
    }

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
