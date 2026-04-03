import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="overlay">
          <h1>Welcome Back</h1>
          <p>Login to schedule and track your e-waste pickup.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>User Login</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ marginTop: "15px" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#00b894", fontWeight: "600" }}>
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
