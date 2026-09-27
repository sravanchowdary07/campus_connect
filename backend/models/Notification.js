const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null or specific user ID
    isGlobal: { type: Boolean, default: false },
    message: { type: String, required: true },
    type: { type: String, enum: ['announcement', 'event', 'complaint', 'system', 'study'], default: 'system' },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
