const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // l'utilisateur qui envoie
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // le match concerné
  content: { type: String, required: true }, // texte du message
  timestamp: { type: Date, default: Date.now } // date d'envoi
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
