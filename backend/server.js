require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");

const app = express();

// Connect DB
connectDB();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS Policy"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Orbitra Travel AI API running smoothly.",
  });
});

// Ping route
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is alive",
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

// Cron job (keep-alive ping)
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
  console.log(`🪐 Server running on port ${PORT}`);
});
