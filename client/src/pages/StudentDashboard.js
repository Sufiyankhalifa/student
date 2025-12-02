import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
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

        // Fetch student profile
        const studentRes = await axios.get(
          "http://localhost:5000/api/auth/student",
          config
        );
        setStudent(studentRes.data);
        setEnrolledCourses(studentRes.data.enrolledCourses);

        // Fetch all available courses
        const coursesRes = await axios.get(
          "http://localhost:5000/api/courses",
          config
        );
        setAvailableCourses(coursesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch student data. Please try again.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        config
      );
      // Update enrolled courses
      const updatedStudentRes = await axios.get(
        "http://localhost:5000/api/auth/student",
        config
      );
      setEnrolledCourses(updatedStudentRes.data.enrolledCourses);
      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll in course. Please try again.");
    }
  };

  const handleDeEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/de-enroll`,
        {},
        config
      );
      // Update enrolled courses
      const updatedStudentRes = await axios.get(
        "http://localhost:5000/api/auth/student",
        config
      );
      setEnrolledCourses(updatedStudentRes.data.enrolledCourses);
      alert("De-enrolled successfully!");
    } catch (err) {
      console.error("Error de-enrolling from course:", err);
      alert("Failed to de-enroll from course. Please try again.");
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading student data...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!student) {
    return (
      <div className="container mt-5">
        <p>Please log in to view your dashboard.</p>
        <Link to="/student/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const enrolledCourseIds = new Set(
    enrolledCourses.filter((c) => c && c._id).map((course) => course._id)
  );

  const availableToEnroll = availableCourses.filter(
    (course) => course && course._id && !enrolledCourseIds.has(course._id)
  );

  // Remove any empty/null course objects before rendering
  const cleanEnrolled = enrolledCourses.filter(
    (c) => c && c._id && c.courseName
  );
  const cleanAvailableToEnroll = availableToEnroll.filter(
    (c) => c && c._id && c.courseName
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome, {student.name}!</h1>

      <div className="mb-5">
        <h2>Your Enrolled Courses</h2>
        {cleanEnrolled.length > 0 ? (
          <div className="row">
            {cleanEnrolled.map((course) => (
              <div className="col-md-4 mb-4" key={course._id}>
                <CourseCard
                  course={course}
                  action="de-enroll"
                  onAction={handleDeEnroll}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses.</p>
        )}
      </div>

      <div>
        <h2>Available Courses</h2>
        {cleanAvailableToEnroll.length > 0 ? (
          <div className="row">
            {cleanAvailableToEnroll.map((course) => (
              <div className="col-md-4 mb-4" key={course._id}>
                <CourseCard
                  course={course}
                  action="enroll"
                  onAction={handleEnroll}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No new courses available to enroll in.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
