import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    srn: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { srn, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login/student",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/student/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Invalid credentials.");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h1 className="card-title text-center mb-4">Student Login</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="srn" className="form-label">
                    SRN
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="srn"
                    value={srn}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <Link to="/register/student">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
