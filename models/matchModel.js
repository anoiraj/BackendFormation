const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  maxPlayers: { type: Number, required: true },
  status: { type: String, enum: ['Scheduled', 'Full', 'Cancelled'], default: 'Scheduled' },

  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin ou matchOrganizer
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,// joueurs participants
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],

}, { timestamps: true });


// Validation : s’assurer qu’il y a au plus 2 équipes
matchSchema.pre("save", function(next) {
  if (this.teams.length > 2) {
    return next(new Error("Un match ne peut pas avoir plus de 2 équipes"));
  }
  next();
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
