const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // celui qui note
  ratedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // celui qui reçoit la note
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // match concerné
  score: { type: Number, min: 1, max: 5, required: true }, // note entre 1 et 5
  comment: { type: String }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
