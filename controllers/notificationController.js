const Notification = require('../models/notificationModel');

// CREATE
module.exports.createNotification = async (req, res) => {
  try {
    const notif = new Notification(req.body);
    const savedNotif = await notif.save();
    res.status(201).json(savedNotif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
module.exports.getAllNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().populate("userId", "username email");
    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
const mongoose = require('mongoose');

module.exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const notif = await Notification.findById(id).populate("userId", "username email");
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE (par ex: marquer comme lue)
module.exports.updateNotification = async (req, res) => {
  try {
    const updatedNotif = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNotif) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(updatedNotif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
module.exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
