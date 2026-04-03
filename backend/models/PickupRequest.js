const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    devices: { type: [String], required: true },   // e.g. ["Laptop", "Phone"]
    address: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);
