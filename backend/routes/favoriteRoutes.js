import express from "express";
import mongoose from "mongoose";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// ✅ Ensure DB connection
const ensureDatabaseConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database not connected",
    });
  }
  next();
};

// ✅ Get user from params or query safely
const getUserFromRequest = (req) => {
  if (req.params.user) {
    return decodeURIComponent(String(req.params.user)).trim();
  }
  if (req.query.user) {
    return String(req.query.user).trim();
  }
  return "";
};

// =========================
// ✅ GET FAVORITES
// =========================

// 👉 Supports BOTH:
// /api/favorites/:user
// /api/favorites?user=email

router.get("/", ensureDatabaseConnected, async (req, res) => {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return res.status(200).json({
        message: "Provide user email",
        favorites: [],
      });
    }

    console.log("📥 Fetching favorites for:", user);

    const favorites = await Favorite.find({
      likedBy: { $eq: user },
    });

    console.log("✅ Found:", favorites.length);

    return res.status(200).json(favorites);
  } catch (err) {
    console.error("❌ FULL ERROR:", err); // 🔥 IMPORTANT
    return res.status(500).json({
      error: "Failed to fetch favorites",
      details: err.message,
      favorites: [],
    });
  }
});

// 👉 Same logic for param route
router.get("/:user", ensureDatabaseConnected, async (req, res) => {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return res.status(400).json({
        error: "User is required",
        favorites: [],
      });
    }

    console.log("📥 Fetching favorites for:", user);

    const favorites = await Favorite.find({
      likedBy: { $eq: user },
    });

    return res.status(200).json(favorites);
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    return res.status(500).json({
      error: "Failed to fetch favorites",
      details: err.message,
      favorites: [],
    });
  }
});

// =========================
// ✅ ADD FAVORITE
// =========================

router.post("/", ensureDatabaseConnected, async (req, res) => {
  try {
    let { movieId, title, poster, rating, likedBy } = req.body;

    if (!movieId || !likedBy) {
      return res.status(400).json({
        error: "movieId and likedBy are required",
      });
    }

    likedBy = String(likedBy).trim();
    rating = Number(rating) || 0;

    const existing = await Favorite.findOne({ movieId, likedBy });

    if (existing) {
      return res.status(200).json({
        message: "Already in favorites",
      });
    }

    const favorite = new Favorite({
      movieId,
      title,
      poster,
      rating,
      likedBy,
    });

    await favorite.save();

    return res.status(201).json({
      message: "Added to favorites",
      favorite,
    });
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    return res.status(500).json({
      error: "Failed to add favorite",
      details: err.message,
    });
  }
});

// =========================
// ✅ DELETE FAVORITE
// =========================

router.delete("/:movieId/:user", ensureDatabaseConnected, async (req, res) => {
  try {
    const movieId = String(req.params.movieId).trim();
    const user = getUserFromRequest(req);

    if (!movieId || !user) {
      return res.status(400).json({
        error: "movieId and user required",
      });
    }

    const removed = await Favorite.findOneAndDelete({
      movieId,
      likedBy: user,
    });

    if (!removed) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    return res.status(200).json({
      message: "Removed from favorites",
    });
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    return res.status(500).json({
      error: "Failed to remove favorite",
      details: err.message,
    });
  }
});

export default router;