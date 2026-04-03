import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./SchedulePickup.css";

function SchedulePickup() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    devices: "",
    address: user?.address || "",
    scheduledDate: "",
    notes: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/pjpeg"];
      const allowedExtensions = [".jpg", ".jpeg"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      if (!allowedMimeTypes.includes(file.type) || !allowedExtensions.includes(fileExt)) {
        setError("Only JPEG (.jpg, .jpeg) images are allowed.");
        setPreview("");
        setImage(null);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        setPreview("");
        setImage(null);
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/user-login");

    if (image && !["image/jpeg", "image/jpg"].includes(image.type)) {
      setError("Please upload a valid JPEG image.");
      return;
    }

    setLoading(true);
    setError("");

    // Convert comma-separated string to array
    const devicesArray = form.devices.split(",").map((d) => d.trim()).filter(Boolean);

    // Create FormData for multipart submission
    const formData = new FormData();
    formData.append("devices", JSON.stringify(devicesArray));
    formData.append("address", form.address);
    formData.append("scheduledDate", form.scheduledDate);
    formData.append("notes", form.notes);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/pickup",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          } 
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule pickup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <h2>Schedule E-Waste Pickup</h2>
        <p>Fill in the details to arrange a secure and eco-friendly pickup.</p>
        
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Devices (comma separated)</label>
            <input
              name="devices"
              type="text"
              placeholder="e.g. Laptop, Phone, Battery"
              value={form.devices}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pickup Address</label>
            <input
              name="address"
              type="text"
              placeholder="Your full address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Preferred Date</label>
            <input
              name="scheduledDate"
              type="date"
              value={form.scheduledDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Upload Device Image (.jpg, .jpeg only, Max 2MB)</label>
            <input
              name="image"
              type="file"
              accept=".jpg,.jpeg"
              onChange={handleChange}
              className="file-input"
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Device Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Any specific instructions..."
              value={form.notes}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Scheduling..." : "Confirm Pickup Request"}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default SchedulePickup;
