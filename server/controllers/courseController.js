// controllers/courseController.js
const Course = require("../models/course");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name");
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Add a new course
exports.addCourse = async (req, res) => {
  // user.id is from the auth middleware (teacher's id)
  const { courseName, courseCode, courseDescription, courseCredits } = req.body;
  try {
    // Check if user is a teacher
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(403).json({ msg: "User is not a teacher" });
    }

    let course = await Course.findOne({ courseCode });
    if (course) {
      return res
        .status(400)
        .json({ msg: "Course with this code already exists" });
    }

    course = new Course({
      courseName,
      courseCode,
      courseDescription,
      courseCredits,
      teacher: req.user.id,
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Edit a course
exports.editCourse = async (req, res) => {
  const { courseName, courseCode, courseDescription, courseCredits } = req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if the user is the teacher who created the course
    if (course.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: { courseName, courseCode, courseDescription, courseCredits } },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const student = await Student.findById(req.user.id);
    if (student.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ msg: "Already enrolled in this course" });
    }

    student.enrolledCourses.push(req.params.id);
    await student.save();
    res.json(student.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// De-enroll from a course
exports.deEnrollCourse = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.user.id, {
      $pull: { enrolledCourses: req.params.id },
    });
    res.json({ msg: "Successfully de-enrolled" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Only the teacher who created the course can delete it
    if (course.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove this course from all students' enrolled lists
    await Student.updateMany(
      { enrolledCourses: req.params.id },
      { $pull: { enrolledCourses: req.params.id } }
    );

    res.json({ msg: "Course removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
