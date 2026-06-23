const Itinerary = require("../models/Itinerary");
const {
  analyzeDocumentAndGenerateItinerary,
  generateItineraryFromPrompt,
} = require("../utils/aiGenerator");

// Define a safe max processing duration (25 seconds) for the external AI APIs
const AI_TIMEOUT_LIMIT = 35000;

// Helper function to handle timing out slow AI promises
const raceWithTimeout = (aiPromise, timeoutMs) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI_TIMEOUT")), timeoutMs),
  );
  return Promise.race([aiPromise, timeoutPromise]);
};

// @desc    Core 01: Upload document & automatically generate itinerary
// @route   POST /api/itinerary/upload
// @access  Private (JWT Guarded)
exports.createItinerary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a travel booking file (PDF or Image).",
      });
    }

    const documentUrl = req.file.path; // Cloudinary resource URL
    const mimeType = req.file.mimetype;

    // 1. Core Data Extraction with a 25-second timeout safeguard race
    const structuredPlan = await raceWithTimeout(
      analyzeDocumentAndGenerateItinerary(documentUrl, mimeType),
      AI_TIMEOUT_LIMIT,
    );

    // 2. 🛡️ Guard Clause Check: Structural Integrity Validation
    if (structuredPlan.isValidTravelDocument === false) {
      return res.status(422).json({
        success: false,
        errorType: "INVALID_DOCUMENT_FORMAT",
        message:
          "Ticket or voucher not valid or not found. Please upload a clear travel booking verification file.",
      });
    }

    // 3. Persist to MongoDB Collection
    const newItinerary = await Itinerary.create({
      user: req.user._id, // Highly optimized query field due to index schema setting
      title: structuredPlan.tripName || "My Generated Trip",
      documentUrl,
      structuredPlan, // Normalized root JSON document payload layout
    });

    res.status(201).json({
      success: true,
      message: "Itinerary successfully tailored!",
      shareToken: newItinerary.shareToken,
      itinerary: newItinerary,
    });
  } catch (error) {
    console.error("Controller Upload Execution Failure:", error);

    // Explicitly catch slow upstream AI services to unlock the UI loader gracefully
    if (error.message === "AI_TIMEOUT") {
      return res.status(504).json({
        success: false,
        errorType: "AI_TIMEOUT_REJECT",
        message:
          "The AI processing engine took too long to read your document. Please verify your connection or try again.",
      });
    }

    res.status(500).json({
      message: "Error processing itinerary generation",
      error: error.message,
    });
  }
};

// @desc    Core 02: Process pure text synthesis prompts via Gemini Engine
// @route   POST /api/itinerary/generate-prompt
// @access  Private (JWT Guarded)
exports.generatePromptItinerary = async (req, res) => {
  try {
    const { title, prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ message: "Synthesis prompt instructions are required." });
    }

    // 1. Execute generative prompt with a 25-second timeout safeguard race
    const structuredPlan = await raceWithTimeout(
      generateItineraryFromPrompt(prompt),
      AI_TIMEOUT_LIMIT,
    );

    // 2. Save directly to DB collection
    const newItinerary = await Itinerary.create({
      user: req.user._id,
      title: title || structuredPlan.tripName || "Custom AI Strategy",
      structuredPlan,
      documentUrl: "text-prompt-generated", // Bypass fallback for text entries
    });

    res.status(201).json({
      success: true,
      message: "Strategy map synthesized successfully!",
      shareToken: newItinerary.shareToken,
      itinerary: newItinerary,
    });
  } catch (error) {
    console.error("Controller Prompt Synthesis Execution Failure:", error);

    if (error.message === "AI_TIMEOUT") {
      return res.status(504).json({
        success: false,
        errorType: "AI_TIMEOUT_REJECT",
        message:
          "The compilation cluster timed out. Try simplifying your parameters or re-submitting.",
      });
    }

    res.status(500).json({
      message: "Error generating strategy profile via context parameters.",
      error: error.message,
    });
  }
};

// @desc    Get all historical itineraries for current logged-in user
// @route   GET /api/itinerary/history
// @access  Private
exports.getUserHistory = async (req, res) => {
  try {
    // ⚡ Fast database lookup engine utilizing your User Index mapping strategy
    const history = await Itinerary.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving trip history",
      error: error.message,
    });
  }
};

// @desc    Get an itinerary via public share token (No Auth Required)
// @route   GET /api/itinerary/share/:token
// @access  Public
exports.getSharedItinerary = async (req, res) => {
  try {
    // Locate the unique data matrix by token field
    const itinerary = await Itinerary.findOne({ shareToken: req.params.token });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found or link has expired.",
      });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error searching for itinerary",
      error: error.message,
    });
  }
};
