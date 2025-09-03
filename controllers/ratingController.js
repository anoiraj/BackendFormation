const Rating = require('../models/ratingModel');

// CREATE
module.exports.createRating = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    const savedRating = await rating.save();
    res.status(201).json(savedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
module.exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("raterId", "username email")
      .populate("ratedId", "username email")
      .populate("matchId", "title date");
    res.status(200).json({ratings : ratings});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
module.exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate("raterId", "username email")
      .populate("ratedId", "username email")
      .populate("matchId", "title date");
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
module.exports.updateRating = async (req, res) => {
  try {
    const updatedRating = await Rating.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRating) return res.status(404).json({ message: "Rating not found" });
    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
module.exports.deleteRating = async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Rating not found" });
    res.status(200).json({ message: "Rating deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les notes d’un match
module.exports.getRatingsByMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const ratings = await Rating.find({ match: matchId }).populate("user", "username email");
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les notes d’un joueur
module.exports.getRatingsByPlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const ratings = await Rating.find({ user: playerId }).populate("match", "title date location");
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculer la moyenne des notes d’un joueur
module.exports.getAverageRatingForPlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const ratings = await Rating.find({ user: playerId });

    if (ratings.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour ce joueur" });
    }

    const avg = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length; //formule
    res.status(200).json({ playerId, average: avg.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculer la moyenne des notes d’une équipe
module.exports.getAverageRatingForTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const ratings = await Rating.find({ team: teamId });

    if (ratings.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cette équipe" });
    }

    const avg = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length; //formule
    res.status(200).json({ teamId, average: avg.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};