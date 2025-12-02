import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="p-5 mb-4 jumbotron rounded-3 shadow-sm">
          <div className="container-fluid py-5 text-center">
            <h1 className="display-5 fw-bold">
              Welcome to the Course Registration System
            </h1>
            <p className="fs-4" style={{ opacity: 0.9 }}>
              Please select your role to continue and manage your academic
              journey with ease.
            </p>
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">Student</h5>
                <p className="card-text">
                  Register or log in as a student to manage your courses.
                </p>
                <div className="mt-auto">
                  <Link to="/login/student" className="btn btn-primary me-2">
                    Login
                  </Link>
                  <Link to="/register/student" className="btn btn-secondary">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">Teacher</h5>
                <p className="card-text">
                  Register or log in as a teacher to manage your courses.
                </p>
                <div className="mt-auto">
                  <Link to="/login/teacher" className="btn btn-primary me-2">
                    Login
                  </Link>
                  <Link to="/register/teacher" className="btn btn-secondary">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
