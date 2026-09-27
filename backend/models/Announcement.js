const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Administrative', 'Events', 'Exam', 'Placement', 'Sports', 'General'],
      default: 'General'
    },
    department: { type: String, default: 'All' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetAudience: { type: String, enum: ['All', 'Students', 'Faculty'], default: 'All' },
    attachments: [{ type: String }],
    isPinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
