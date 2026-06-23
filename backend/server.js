require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // 🔥 Required for the keep-awake system
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); 
const itineraryRoutes = require("./routes/itineraryRoutes");

const app = express();

// Connect to MongoDB Database
connectDB();

// 🚀 PRODUCTION CORS CONFIGURATION
// Whitelists local testing ports and your future live deployment link
const allowedOrigins = [
  "http://localhost:5173", // Vite local port
  "http://localhost:3000", // Create React App local port
  process.env.FRONTEND_URL  // Live deployment url (e.g., Vercel / Netlify)
].filter(Boolean); // 🔥 Removes undefined values if FRONTEND_URL is not set locally

app.use(cors({
  origin: function (origin, callback) {
    // Allows server access if origin matches our whitelist or is an internal tool (like Postman/Insomnia)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by Orbitra Security Core CORS Policy"));
    }
  },
  credentials: true
}));

// Global Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ⚡ Safely parses form fields when users upload files via FormData

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Travel AI API running smoothly." 
  });
});

// ⏰ SELF-PING KEEPAWAKE CHRONOGRAPH SYSTEM
// Transmits a request to your web service layout infrastructure every 13 minutes 
// preventing Render's free tier engine from executing an inactivity sleep cycle.
const LIVE_BACKEND_URL = process.env.BACKEND_URL; 

if (LIVE_BACKEND_URL) {
  const THIRTEEN_MINUTES = 13 * 60 * 1000; // Value normalized to milliseconds
  setInterval(async () => {
    try {
      const response = await axios.get(LIVE_BACKEND_URL);
      console.log(`🪐 Keep-alive heartbeat successful: ${response.data.message}`);
    } catch (error) {
      console.warn("⚠️ Keep-alive heartbeat warning:", error.message);
    }
  }, THIRTEEN_MINUTES);
}

// 🛡️ Global Error Handling Middleware
// Catches CORS blocks and internal crashes, returning neat JSON instead of raw HTML stack traces
app.use((err, req, res, next) => {
  console.error("⛔ System Error Context Triggered:", err.message);
  
  const statusCode = err.message.includes("CORS") ? 403 : 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || "An internal error occurred within the Orbitra cluster."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🪐 Server navigating on port ${PORT}`);
});
