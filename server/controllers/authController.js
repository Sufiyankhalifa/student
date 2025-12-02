// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Course = require("../models/course");
const Teacher = require("../models/teacher");

// -----------------------------
// Student Registration
// -----------------------------
exports.registerStudent = async (req, res) => {
  const { name, srn, password } = req.body;
  try {
    let student = await Student.findOne({ srn });
    if (student) return res.status(400).json({ msg: "Student already exists" });

    student = new Student({ name, srn, password });
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    await student.save();

    const payload = { student: { id: student.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -----------------------------
// Student Login
// -----------------------------
exports.loginStudent = async (req, res) => {
  const { srn, password } = req.body;
  try {
    let student = await Student.findOne({ srn });
    if (!student) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { student: { id: student.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// -----------------------------
// Teacher Registration
// -----------------------------
exports.registerTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ msg: "Teacher already exists" });
    }

    teacher = new Teacher({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(password, salt);
    await teacher.save();

    const payload = { teacher: { id: teacher.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// -----------------------------
// Teacher Login
// -----------------------------
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    let teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { teacher: { id: teacher.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// -----------------------------
// Get Logged-in User Data
// -----------------------------
exports.getStudentData = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("enrolledCourses");
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getTeacherData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    const courses = await Course.find({ teacher: req.user.id });
    res.json({ teacher, courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
