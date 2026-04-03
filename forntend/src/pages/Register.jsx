import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", password: "",
  });
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
        "http://localhost:5000/api/auth/register",
        form
      );
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="overlay">
          <h1>Create Account</h1>
          <p>Register to schedule safe e-waste pickup.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>User Registration</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <input name="phone" type="text" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input name="address" type="text" placeholder="Address" value={form.address} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <span>
            Already registered?{" "}
            <Link to="/user-login" style={{ color: "#00b894", fontWeight: "600" }}>
              Login Here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;