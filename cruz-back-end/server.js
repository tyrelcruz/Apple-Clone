require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const path = require("path");

const app = express();

// Database Connection
connectDB();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Basic middleware
app.use(express.json());
app.use(cors(corsOptions));

// Handle OPTIONS requests
app.options("*", cors(corsOptions));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is working" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}`);
});
