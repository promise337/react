import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { saveAuthData } from "../utils/authStorage";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ Map email → username for backend
      const data = await loginUser(username, password);

      saveAuthData(data);

      navigate("/subscription");

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="xnett-logo">
          <div className="logo">
            <img src="/omni_logo.png" alt="OmniBSIC Logo" />
          </div>
        </div>

        <h1>Login</h1>
        <div className="login-desc">
          Enter your login credentials
        </div>

        <div className="login-form">
          <form className="form" onSubmit={handleSubmit}>

            {error && <div className="error-text">{error}</div>}

            <div className="form-group">
              <label>Username </label>
              <input
                className="form-control"
                type="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                autoComplete="current-username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>

        <div className="footer-text">
          ©2025 OmniBSIC Bank. Powered by Xnett. All rights reserved.
        </div>
      </div>

      <div className="login-img" />
    </div>
  );
};

export default Login;
