const Course = require('../models/Course');
    const Enrollment = require('../models/Enrollment');

    exports.createCourse = async (req, res) => {
      const { title, description, category, modules } = req.body;
      try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
          return res.status(403).json({ msg: 'Only admins can create courses' });
        }

        const parsedModules = modules ? JSON.parse(modules) : [];

        // Create a map of uploaded files
        const fileMap = {};
        if (req.files && Array.isArray(req.files)) {
          for (const file of req.files) {
            fileMap[file.fieldname] = file.path;
          }
        }

        // Debug: Log uploaded files
        console.log('Uploaded files in createCourse:', fileMap);

        const course = new Course({
          title,
          description,
          category,
          author: req.user.userId,
          image: fileMap['thumbnail'] || '', // Store thumbnail URL
          modules: parsedModules.map((module, moduleIndex) => ({
            title: module.title,
            topics: module.topics.map((topic, topicIndex) => ({
              title: topic.title,
              youtubeUrl: topic.youtubeUrl || '',
              description: topic.description || '',
              notesUrl: fileMap[`notes_${moduleIndex}_${topicIndex}`] || '',
            })),
          })),
        });

        await course.save();
        res.json(course);
      } catch (err) {
        console.error('Error in createCourse:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getCourses = async (req, res) => {
      try {
        const courses = await Course.find().populate('author', 'name');
        res.json(courses);
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getUserCourses = async (req, res) => {
      try {
        const courses = await Course.find({ author: req.user.userId }).populate('author', 'name');
        res.json(courses);
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getCourseById = async (req, res) => {
      try {
        const course = await Course.findById(req.params.id).populate('author', 'name');
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json(course);
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.updateCourse = async (req, res) => {
      const { title, description, category, modules } = req.body;
      try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
          return res.status(403).json({ msg: 'Only admins can update courses' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        const parsedModules = modules ? JSON.parse(modules) : course.modules;

        // Create a map of uploaded files
        const fileMap = {};
        if (req.files && Array.isArray(req.files)) {
          for (const file of req.files) {
            fileMap[file.fieldname] = file.path;
          }
        }

        // Debug: Log uploaded files
        console.log('Uploaded files in updateCourse:', fileMap);

        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.image = fileMap['thumbnail'] || course.image; // Update thumbnail if provided
        course.modules = parsedModules.map((module, moduleIndex) => ({
          title: module.title,
          topics: module.topics.map((topic, topicIndex) => ({
            title: topic.title,
            youtubeUrl: topic.youtubeUrl,
            description: topic.description,
            notesUrl: fileMap[`notes_${moduleIndex}_${topicIndex}`] || topic.notesUrl || '',
          })),
        }));

        await course.save();
        res.json(course);
      } catch (err) {
        console.error('Error in updateCourse:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.deleteCourse = async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
          return res.status(403).json({ msg: 'Unauthorized' });
        }

        await course.deleteOne();
        res.json({ msg: 'Course deleted' });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getAllCourses = async (req, res) => {
      try {
        const courses = await Course.find().populate('author', 'name');
        res.json(courses);
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.enrollCourse = async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        const existingEnrollment = await Enrollment.findOne({
          user: req.user.userId,
          course: req.params.id,
        });
        if (existingEnrollment) return res.status(400).json({ msg: 'Already enrolled' });

        const enrollment = new Enrollment({
          user: req.user.userId,
          course: req.params.id,
        });
        await enrollment.save();
        res.json({ msg: 'Enrolled successfully' });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getCourseContent = async (req, res) => {
      try {
        const course = await Course.findById(req.params.id).populate('author', 'name');
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        const enrollment = await Enrollment.findOne({
          user: req.user.userId,
          course: req.params.id,
        });

        res.json({
          course,
          isEnrolled: !!enrollment,
          completedTopics: enrollment ? enrollment.completedTopics : [],
        });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.markTopicComplete = async (req, res) => {
      const { topicId } = req.body;
      try {
        const enrollment = await Enrollment.findOne({
          user: req.user.userId,
          course: req.params.id,
        });
        if (!enrollment) return res.status(400).json({ msg: 'Not enrolled in this course' });

        if (!enrollment.completedTopics.includes(topicId)) {
          enrollment.completedTopics.push(topicId);
          await enrollment.save();
        }
        res.json({ msg: 'Topic marked as complete' });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    };