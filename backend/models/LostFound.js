const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    category: {
      type: String,
      enum: ['Electronics', 'ID Card / Documents', 'Keys / Wallet', 'Clothing', 'Books / Stationery', 'Other'],
      default: 'Other'
    },
    location: { type: String, required: true },
    dateHappened: { type: Date, default: Date.now },
    itemImage: { type: String, default: '' },
    contactInfo: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
