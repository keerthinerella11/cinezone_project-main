import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

console.log("📌 server.js is loading");

import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

console.log("reviewRoutes in server:", reviewRoutes);

dotenv.config(); // ✅ Load .env first

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
console.log("✅ User routes registered");
app.use("/api/favorites", favoriteRoutes);
console.log("✅ Favorite routes registered");
app.use("/api/reviews", reviewRoutes);
console.log("✅ Review routes registered"); 

// ✅ Check MongoDB URI
console.log("MONGO_URI configured:", !!process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in environment variables!");
}

// ✅ MongoDB Connection with Retry Logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cinezone", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ✅ Default route
app.get("/", (req, res) => res.send("CineZone Backend Running ✅"));

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ status: "Server is running", database: status });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
