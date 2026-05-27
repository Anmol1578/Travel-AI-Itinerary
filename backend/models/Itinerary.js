const mongoose = require("mongoose");
const crypto = require("crypto");

const ItinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Kept for our fast history querying optimization!
    },
    title: { type: String, required: true, default: "My Generated Trip" },
    documentUrl: { type: String, required: false },
    structuredPlan: { type: Object, required: true },
    shareToken: { type: String, unique: true },
  },
  { timestamps: true },
);

// ✨ FIXED: Removed 'next' argument and switched to a clean synchronous return hook.
// Mongoose natively tracks document modifications here without needing a callback function.
ItinerarySchema.pre("save", function () {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString("hex");
  }
  // No next() call needed! Mongoose proceeds automatically when this finishes executing.
});

module.exports = mongoose.model("Itinerary", ItinerarySchema);
