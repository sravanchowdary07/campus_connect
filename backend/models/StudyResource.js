const mongoose = require('mongoose');

const studyResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    category: {
      type: String,
      enum: ['Notes', 'Question Paper', 'Syllabus', 'Reference Book', 'Lab Manual'],
      default: 'Notes'
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, default: '1.2 MB' },
    fileType: { type: String, default: 'pdf' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    downloadsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyResource', studyResourceSchema);
