require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Database Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://nd-client-pi.vercel.app",
  "https://appleclonebackend.vercel.app",
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow requests from localhost during development
  if (
    process.env.NODE_ENV === "development" ||
    allowedOrigins.includes(origin)
  ) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin || "http://localhost:5173"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Welcome message route
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.json({
    message: "Welcome to Cruz MERN API",
    status: "Server is running",
    endpoints: {
      users: "/api/users",
      articles: "/api/articles",
      stats: "/api/users/stats",
    },
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

// Error Handling with CORS headers
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404 routes with CORS headers
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(404).json({ message: "Route not found" });
});

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
