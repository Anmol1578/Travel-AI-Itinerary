require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./config/db");
<<<<<<< HEAD
const authRoutes = require("./routes/authRoutes");
=======
const authRoutes = require("./routes/authRoutes"); 
>>>>>>> d7c9d9e50dbf192550be6362ac27e1473c30c50f
const itineraryRoutes = require("./routes/itineraryRoutes");

const app = express();

// Connect to MongoDB Database
connectDB();

// 🚀 PRODUCTION CORS CONFIGURATION
// Whitelists local testing ports and your future live deployment link
const allowedOrigins = [
  "http://localhost:5173", // Vite local port
  "http://localhost:3000", // Create React App local port
<<<<<<< HEAD
  process.env.FRONTEND_URL, // Will securely hold your live Render frontend link!
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allows server access if origin matches our whitelist or is an internal tool (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by Orbitra Security Core CORS Policy"));
      }
    },
    credentials: true,
  }),
);
=======
  process.env.FRONTEND_URL // Will securely hold your live Render frontend link!
];

app.use(cors({
  origin: function (origin, callback) {
    // Allows server access if origin matches our whitelist or is an internal tool (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by Orbitra Security Core CORS Policy"));
    }
  },
  credentials: true
}));
>>>>>>> d7c9d9e50dbf192550be6362ac27e1473c30c50f

app.use(express.json());

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Orbitra Travel AI API running smoothly." });
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Orbit server is alive",
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

cron.schedule("*/14 * * * *", async () => {
  try {
    const res = await fetch(
      "https://travel-ai-itinerary-web.onrender.com/api/ping"
    );

    console.log("Ping success:", res.status);
  } catch (err) {
    console.log("Ping failed:", err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🪐 Server navigating on port ${PORT}`);
});
