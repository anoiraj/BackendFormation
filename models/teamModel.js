const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, //wa7ed bark
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // liste des joueurs
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
