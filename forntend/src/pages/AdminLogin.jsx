import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function AdminLogin() {
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
        "http://localhost:5000/api/auth/admin-login",
        form
      );
      login(data.token, data.user);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="overlay">
          <h1>Admin Portal</h1>
          <p>Secure management access for authorized personnel.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Admin Login</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Secure Login"}
            </button>
          </form>
          <span>Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;