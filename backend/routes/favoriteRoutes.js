import express from "express";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// ✅ Add a movie to favorites
router.post("/", async (req, res) => {
  try {
    const { movieId, title, poster, rating, likedBy } = req.body;

    if (!movieId || !likedBy) {
      return res.status(400).json({ error: "movieId and likedBy are required" });
    }

    const existing = await Favorite.findOne({ movieId, likedBy });
    if (existing) {
      return res.status(200).json({ message: "Already in favorites" });
    }

    const favorite = new Favorite({
      movieId,
      title,
      poster,
      rating,
      likedBy,
    });

    await favorite.save();
    return res.status(201).json({ message: "Added to favorites", favorite });
  } catch (err) {
    console.error("❌ Error adding favorite:", err.message);
    res.status(500).json({ error: "Failed to add favorite", details: err.message });
  }
});

// ✅ Get all favorites for a user
router.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    console.log(`Fetching favorites for user: ${user}`);
    
    if (!user || user === "undefined" || user === "null") {
      return res.status(400).json({ error: "User parameter is required", favorites: [] });
    }

    const favorites = await Favorite.find({ likedBy: user });
    console.log(`Found ${favorites.length} favorites for user: ${user}`);
    return res.json(favorites);
  } catch (err) {
    console.error("❌ Error fetching favorites:", err.message);
    res.status(500).json({ error: "Failed to fetch favorites", details: err.message, favorites: [] });
  }
});

// ✅ Fallback for requests to /api/favorites without a user param
router.get("/", async (req, res) => {
  return res.json({ message: "Provide a user email in the URL: /api/favorites/:user", favorites: [] });
});

// ✅ Remove a movie from favorites
router.delete("/:movieId/:user", async (req, res) => {
  try {
    const { movieId, user } = req.params;
    console.log(`Removing favorite: movieId=${movieId}, user=${user}`);
    
    if (!movieId || !user) {
      return res.status(400).json({ error: "movieId and user are required" });
    }

    const removed = await Favorite.findOneAndDelete({ movieId, likedBy: user });
    if (!removed) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("❌ Error removing favorite:", err.message);
    res.status(500).json({ error: "Failed to remove favorite", details: err.message });
  }
});

export default router;
