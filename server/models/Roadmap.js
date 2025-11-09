const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    content: { type: String }, // Text content
    files: [{ type: String }], // Array of file paths (PDF, images)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);