// routes/notifications.js
import express from 'express';
const notificationrouter = express.Router();
import Notification from '../Models/Notification.js';
import protect from '../Middleware/auth.js';
// Get all notifications
notificationrouter.get('/',protect, async (req, res) => {
  try {
    const id=req.user._id;
    const notifications = await Notification.find({sender:id}).populate('sender','-password');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new notification
notificationrouter.post('/',protect, async (req, res) => {
  try {
    const sender = req.user._id;
    if (!sender) throw new Error('Sender not found');

    const notification = new Notification({
      sender: sender,
      message: req.body.message,
    });

    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default notificationrouter;
