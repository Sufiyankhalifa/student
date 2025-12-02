// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register/student", authController.registerStudent);
router.post("/login/student", authController.loginStudent);
router.post("/register/teacher", authController.registerTeacher);
router.post("/login/teacher", authController.loginTeacher);

// @route   GET api/auth/student
// @desc    Get logged in student data
router.get("/student", auth, authController.getStudentData);

// @route   GET api/auth/teacher
// @desc    Get logged in teacher data
router.get("/teacher", auth, authController.getTeacherData);

module.exports = router;
