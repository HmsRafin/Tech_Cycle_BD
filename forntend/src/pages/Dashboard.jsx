import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const statusColor = { pending: "#f39c12", approved: "#00b894", rejected: "#e74c3c" };

function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) { navigate("/user-login"); return; }
    if (user.role === "admin") { navigate("/admin-dashboard"); return; }

    axios
      .get("http://localhost:5000/api/pickup/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    
    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/pjpeg"];
    const allowedExtensions = [".jpg", ".jpeg"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedMimeTypes.includes(file.type) || !allowedExtensions.includes(fileExt)) {
      alert("Only JPEG (.jpg, .jpeg) images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/pickup/${id}/image`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, image: data.image } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <div className="dash-actions">
          <Link to="/schedule-pickup" className="btn-primary">+ Schedule Pickup</Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h2>Your Pickup Requests</h2>

      {loading ? (
        <p className="dash-loading">Loading your requests...</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No pickup requests yet.</p>
          <Link to="/schedule-pickup" className="btn-primary">Schedule Your First Pickup</Link>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((r) => (
            <div className="request-card" key={r._id}>
              <div className="request-status" style={{ background: statusColor[r.status] }}>
                {r.status.toUpperCase()}
              </div>
              <h3>Devices</h3>
              <p>{r.devices.join(", ")}</p>
              <h3>Address</h3>
              <p>{r.address}</p>
              <h3>Scheduled Date</h3>
              <p>{new Date(r.scheduledDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
              {r.notes && <><h3>Notes</h3><p>{r.notes}</p></>}

              <div className="request-image-section">
                {r.image ? (
                  <div className="image-container">
                    <h3>Pickup Image</h3>
                    <img src={`http://localhost:5000/${r.image}`} alt="Pickup" className="dash-img" />
                  </div>
                ) : (
                  <div className="add-image-area">
                    <p>No image uploaded</p>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg" 
                      onChange={(e) => handleImageUpload(r._id, e.target.files[0])} 
                      id={`file-${r._id}`}
                      style={{ display: "none" }}
                    />
                    <label htmlFor={`file-${r._id}`} className="mini-upload-btn">
                      + Add Photo (.jpg, .jpeg only)
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
