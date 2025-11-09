const Roadmap = require('../../models/Roadmap');

    exports.createRoadmap = async (req, res) => {
      try {
        const { subject, content } = req.body;
        const files = [];

        if (req.files && Array.isArray(req.files)) {
          for (const file of req.files) {
            files.push(file.path);
          }
        }

        const roadmap = new Roadmap({ subject, content, files });
        await roadmap.save();
        res.status(201).json(roadmap);
      } catch (err) {
        console.error('Error creating roadmap:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.getRoadmaps = async (req, res) => {
      try {
        const roadmaps = await Roadmap.find();
        res.json(roadmaps);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.updateRoadmap = async (req, res) => {
      try {
        const { subject, content } = req.body;
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });

        let files;
        if (req.files && Array.isArray(req.files)) {
          files = [];
          for (const file of req.files) {
            files.push(file.path);
          }
        }

        roadmap.subject = subject || roadmap.subject;
        roadmap.content = content || roadmap.content;
        if (files) roadmap.files = files;
        await roadmap.save();
        res.json(roadmap);
      } catch (err) {
        console.error('Error updating roadmap:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };

    exports.deleteRoadmap = async (req, res) => {
      try {
        const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
        if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
        res.json({ msg: 'Roadmap deleted' });
      } catch (err) {
        console.error('Error deleting roadmap:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    };