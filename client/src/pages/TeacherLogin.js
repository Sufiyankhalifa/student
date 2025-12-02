import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login/teacher",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/teacher/dashboard");
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
              <h1 className="card-title text-center mb-4">Teacher Login</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
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
                <Link to="/register/teacher">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
