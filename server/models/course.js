// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  courseDescription: { type: String, default: "" },
  courseCredits: { type: Number, required: true, default: 3 },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
