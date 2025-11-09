// filepath: server/models/Course.js
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeUrl: { type: String }, // YouTube video URL
    notesUrl: { type: String }, // PDF notes URL
    description: { type: String }, // Topic description
});

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topics: [TopicSchema],
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    image: { type: String }, // Optional: For course thumbnail
    modules: [ModuleSchema], // Array of modules
});

CourseSchema.pre('findOneAndDelete', async function(next) {
    const courseId = this.getQuery()['_id'];
    await Enrollment.deleteMany({ course: courseId });
    next();
});

module.exports = mongoose.model('Course', CourseSchema);