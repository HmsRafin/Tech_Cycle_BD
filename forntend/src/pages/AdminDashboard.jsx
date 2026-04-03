import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    fetchRequests();
  }, [user, token, navigate]);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/requests/${id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, image: "" } : r))
      );
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Control Panel 🔒</h1>
        <p>Manage all e-waste pickup requests across the platform.</p>
      </div>

      {loading ? (
        <p className="loading">Fetching requests...</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Devices</th>
                <th>Address</th>
                <th>Image</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.userName}</td>
                  <td>{r.userId?.email}<br/><small>{r.userId?.phone}</small></td>
                  <td>{r.devices.join(", ")}</td>
                   <td>{r.address}</td>
                  <td>
                    {r.image ? (
                      <img 
                        src={`http://localhost:5000/${r.image}`} 
                        alt="E-waste" 
                        className="admin-thumb" 
                        onClick={() => setSelectedImage(`http://localhost:5000/${r.image}`)}
                      />
                    ) : (
                      <span className="no-img">No Image</span>
                    )}
                  </td>
                  <td>{new Date(r.scheduledDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {r.image && (
                        <button 
                          className="delete-img-btn"
                          onClick={() => deleteImage(r._id)}
                        >
                          Delete Image
                        </button>
                      )}
                      {r.status === "pending" && (
                        <>
                          <button 
                            className="approve-btn"
                            onClick={() => updateStatus(r._id, "approved")}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => updateStatus(r._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status !== "pending" && <span className="done-text">Processed</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Large view" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
