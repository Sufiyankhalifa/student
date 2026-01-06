// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// API Routes (ALWAYS FIRST)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));

// Serve client build (single-service deployment)
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// React fallback — NODE 22 SAFE
app.use((req, res) => {
  // Let API routes fail naturally
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ msg: "API route not found" });
  }

  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
