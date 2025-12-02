// routes/courses.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth"); // Middleware to protect routes

// @route   GET api/courses
// @desc    Get all courses
router.get("/", auth, courseController.getAllCourses);
router.post("/", auth, courseController.addCourse);
router.put("/:id", auth, courseController.editCourse);
router.post("/:id/enroll", auth, courseController.enrollCourse);
router.post("/:id/de-enroll", auth, courseController.deEnrollCourse);
// Delete a course (only teacher who created it)
router.delete("/:id", auth, courseController.deleteCourse);

module.exports = router;
