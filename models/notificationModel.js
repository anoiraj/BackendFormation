const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // à qui appartient la notif (receiver)
  content: { type: String, required: true }, // texte de la notif
  type: { type: String, enum: ['MatchUpdate', 'Message', 'Reminder'], required: true }, // type
  isRead: { type: Boolean, default: false } // statut
  
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
