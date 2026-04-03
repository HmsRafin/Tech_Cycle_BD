const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { deleteFile } = require("../utils/fileUtils");

// ─── POST /api/pickup — Create a new pickup request ────────────────────────
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    let { devices, address, scheduledDate, notes } = req.body;

    // When using FormData, devices might come as a string
    if (typeof devices === "string") {
      try {
        devices = JSON.parse(devices);
      } catch (e) {
        devices = [devices];
      }
    }

    if (!devices || !devices.length || !address || !scheduledDate) {
      return res.status(400).json({ message: "Devices, address and date are required" });
    }

    const request = await PickupRequest.create({
      userId: req.user.id,
      userName: req.user.name,
      devices,
      address,
      scheduledDate,
      notes: notes || "",
      image: req.file ? req.file.path : "",
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/pickup/mine — Get logged-in user's requests ─────────────────
router.get("/mine", protect, async (req, res) => {
  try {
    const requests = await PickupRequest.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── PATCH /api/pickup/:id/image — Update/Add image to request ────────────
router.patch("/:id/image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const request = await PickupRequest.findById(req.params.id);
    if (!request) {
      deleteFile(req.file.path); // Cleanup new file if request not found
      return res.status(404).json({ message: "Pickup request not found" });
    }

    // Ensure only owner can update
    if (request.userId.toString() !== req.user.id) {
      deleteFile(req.file.path); // Cleanup new file
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete OLD image if it exists
    if (request.image) {
      deleteFile(request.image);
    }

    request.image = req.file.path;
    await request.save();

    res.json({ message: "Image updated successfully", image: request.image });
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
