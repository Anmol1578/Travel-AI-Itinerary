// require('dotenv').config();

// const express = require('express');
// const connectDB = require('./config/db');

// const app = express();

// // Connect Database
// connectDB();

// app.get('/', (req, res) => {
//   res.send('API Running');
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// const app = express();

// // Connect to MongoDB Database
// connectDB();

// // Global Middlewares
// app.use(cors());
// app.use(express.json()); // Parses incoming application/json requests

// // Base Health Check Route
// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Orbitra Travel AI API running smoothly." });
// });

// // Port configuration
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🪐 Server navigating on port ${PORT}`);
// });



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes"); // 1. Import Auth Routes
// const itineraryRoutes = require("./routes/itineraryRoutes");

// const app = express();

// // Connect to MongoDB Database
// connectDB();

// // Global Middlewares
// app.use(cors());
// app.use(express.json());

// // 2. Mount API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/itinerary", itineraryRoutes);

// // Base Health Check Route
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Orbitra Travel AI API running smoothly." });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🪐 Server navigating on port ${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

app.use(express.json());

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Orbitra Travel AI API running smoothly." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🪐 Server navigating on port ${PORT}`);
});