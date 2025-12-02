import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    srn: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, srn, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      const newUser = { name, srn, password };
      const res = await axios.post(
        "http://localhost:5000/api/auth/register/student",
        newUser
      );
      localStorage.setItem("token", res.data.token);
      navigate("/student/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Registration failed.");
      } else {
        setError(
          "Registration failed. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <div className="page-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h1 className="card-title text-center mb-4">Student Register</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SRN"
                    name="srn"
                    value={srn}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    minLength="6"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link to="/login/student">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
