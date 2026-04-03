const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");
const { deleteFile } = require("../utils/fileUtils");

// ─── GET /api/admin/requests — Get ALL pickup requests ─────────────────────
router.get("/requests", protect, adminOnly, async (req, res) => {
  try {
    const requests = await PickupRequest.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── PATCH /api/admin/requests/:id — Update status ────────────────────────
router.patch("/requests/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/admin/users — Get all registered users ──────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /api/admin/requests/:id/image — Admin delete image ─────────────
router.delete("/requests/:id/image", protect, adminOnly, async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.image) {
      deleteFile(request.image);
      request.image = "";
      await request.save();
    }

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
