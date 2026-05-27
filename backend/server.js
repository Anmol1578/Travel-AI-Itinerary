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



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // 1. Import Auth Routes
const itineraryRoutes = require("./routes/itineraryRoutes");

const app = express();

// Connect to MongoDB Database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// 2. Mount API Routes
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
