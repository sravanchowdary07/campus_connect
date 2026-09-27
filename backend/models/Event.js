const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Cultural', 'Technical', 'Sports', 'Workshop', 'Seminar', 'Other'],
      default: 'Technical'
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    maxCapacity: { type: Number, default: 100 },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bannerImage: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
