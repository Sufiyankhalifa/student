import React from "react";

const CourseCard = ({ course, action, onAction }) => {
  const buttonText = action === "enroll" ? "Enroll" : "De-enroll";
  const buttonClass =
    action === "enroll" ? "btn btn-success" : "btn btn-danger";

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.courseName}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{course.courseCode}</h6>
        <p className="card-text">
          {course.courseDescription || "No description available."}
        </p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Credits:</strong> {course.courseCredits}
          </li>
        </ul>
        <div className="mt-auto pt-3">
          <button
            onClick={() => onAction(course._id)}
            className={`${buttonClass} w-100`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
