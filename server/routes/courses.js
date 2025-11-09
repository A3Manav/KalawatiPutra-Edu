const express = require('express');
    const router = express.Router();
    const courses = require('../controllers/courses');
    const auth = require('../middleware/auth');
    const upload = require('../middleware/upload');

    router.post('/', auth, upload.any(), courses.createCourse);
    router.get('/', courses.getAllCourses);
    router.get('/user', auth, courses.getUserCourses);
    router.get('/:id', courses.getCourseById);
    router.put('/:id', auth, upload.any(), courses.updateCourse);
    router.delete('/:id', auth, courses.deleteCourse);
    router.post('/:id/enroll', auth, courses.enrollCourse);
    router.get('/:id/content', auth, courses.getCourseContent);
    router.post('/:id/complete', auth, courses.markTopicComplete);

    module.exports = router;