import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the add/edit course form
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    courseDescription: "",
    courseCredits: 3,
  });
  const [editingCourse, setEditingCourse] = useState(null); // To hold the course being edited

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        // These endpoints need to be created on the backend
        const teacherRes = await axios.get(
          "http://localhost:5000/api/auth/teacher",
          config
        );
        setTeacher(teacherRes.data.teacher);

        setCourses(teacherRes.data.courses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError("Failed to fetch teacher data. Please try again.");
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const { courseName, courseCode, courseDescription, courseCredits } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      // Handle edit
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.put(
          `http://localhost:5000/api/courses/${editingCourse._id}`,
          formData,
          config
        );
        setCourses(
          courses.map((course) =>
            course._id === editingCourse._id ? res.data : course
          )
        );
        alert("Course updated successfully!");
      } catch (err) {
        if (err.response) {
          alert(err.response.data.msg || "Failed to update course.");
        } else {
          alert("Failed to update course. Check your connection.");
        }
      }
      setEditingCourse(null);
    } else {
      // Handle add
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.post(
          "http://localhost:5000/api/courses",
          formData,
          config
        );
        setCourses([...courses, res.data]);
        alert("Course added successfully!");
      } catch (err) {
        if (err.response) {
          alert(err.response.data.msg || "Failed to add course.");
        } else {
          alert("Failed to add course. Check your connection.");
        }
      }
    }
    // Clear form
    setFormData({
      courseName: "",
      courseCode: "",
      courseDescription: "",
      courseCredits: 3,
    });
  };

  const startEditing = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      courseCode: course.courseCode,
      courseDescription: course.courseDescription || "",
      courseCredits: course.courseCredits || 3,
    });
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };
      await axios.delete(
        `http://localhost:5000/api/courses/${courseId}`,
        config
      );
      setCourses(courses.filter((c) => c._id !== courseId));
      alert("Course deleted successfully.");
    } catch (err) {
      console.error("Error deleting course:", err);
      if (err.response) {
        alert(err.response.data.msg || "Failed to delete course.");
      } else {
        alert("Failed to delete course. Check your connection.");
      }
    }
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setFormData({
      courseName: "",
      courseCode: "",
      courseDescription: "",
      courseCredits: 3,
    });
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!teacher) {
    return (
      <div className="container mt-5">
        <p>Please log in to view your dashboard.</p>
        <Link to="/teacher/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome, {teacher.name}!</h1>

      <div className="row">
        <div className="col-md-8">
          <h2>Your Courses</h2>
          {courses.length > 0 ? (
            <ul className="list-group">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {course.courseName} ({course.courseCode})
                  <div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => startEditing(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not created any courses yet.</p>
          )}
        </div>
        <div className="col-md-4">
          <h2>{editingCourse ? "Edit Course" : "Add New Course"}</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="courseName"
                value={courseName}
                onChange={onChange}
                placeholder="Course Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="courseCode"
                value={courseCode}
                onChange={onChange}
                placeholder="Course Code"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                name="courseDescription"
                value={courseDescription}
                onChange={onChange}
                placeholder="Course Description"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="courseCredits" className="form-label">
                Credits
              </label>
              <input
                type="number"
                className="form-control"
                name="courseCredits"
                id="courseCredits"
                value={courseCredits}
                onChange={onChange}
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingCourse ? "Update Course" : "Add Course"}
            </button>
            {editingCourse && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
