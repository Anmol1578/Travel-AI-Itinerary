const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../config/cloudinary");
const protect = require("../middleware/authMiddleware");
const {
  createItinerary,
  getUserHistory,
  getSharedItinerary,
  generatePromptItinerary,
} = require("../controllers/itineraryController");

// Assign the single file parser to look for the 'document' field matching your code
const uploadMiddleware = uploadCloud.single("document");

// =========================================================================
// Guarded Private Operational Endpoints
// =========================================================================

// 🚀 Core 01: File Parsing Pipeline (With Strict Error & 5MB Handling Interceptor)
router.post(
  "/upload",
  protect,
  (req, res, next) => {
    uploadMiddleware(req, res, function (err) {
      // 1. Catch Multer limit rules (like File Size violations)
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error:
              "File size limit exceeded. Maximum file size allowed is 5MB.",
          });
        }
        return res.status(400).json({
          success: false,
          error: `Upload subsystem failure: ${err.message}`,
        });
      }

      // 2. Catch explicit custom filter errors from your config file (e.g., INVALID_FILE_TYPE)
      else if (err) {
        if (err.message === "INVALID_FILE_TYPE") {
          return res.status(400).json({
            success: false,
            error:
              "Invalid document format. Please upload a standard PDF or Image asset.",
          });
        }
        return res.status(500).json({
          success: false,
          error: `Cloud connection interrupted: ${err.message}`,
        });
      }

      // 3. Ensure a file structure actually reached the router request
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No active travel document payload detected.",
        });
      }

      // Pass execution downstream to your createItinerary controller safely
      next();
    });
  },
  createItinerary,
);

// Core 02: Pure Text Prompt Generation Pipeline (No Cloudinary middleware required)
router.post("/generate-prompt", protect, generatePromptItinerary);

// Core 03: History Lookup Fetching Node
router.get("/history", protect, getUserHistory);

// =========================================================================
// Open Public Sharing Pipeline Endpoints
// =========================================================================

// Public routing link mapping via unique tokens
router.get("/share/:token", getSharedItinerary);

module.exports = router;
