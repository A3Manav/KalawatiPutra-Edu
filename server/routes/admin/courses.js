const express = require('express');
const { getAllCourses } = require('../../controllers/courses');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router.get('/', adminAuth, getAllCourses);

module.exports = router;