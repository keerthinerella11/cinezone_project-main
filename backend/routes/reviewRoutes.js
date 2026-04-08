import express from "express";
import Review from "../models/Review.js";

console.log("reviewRoutes imported");

const router = express.Router();

// ✅ Add a review
router.post("/", async (req, res) => {
  try {
    const { movieId, userEmail, rating, comment } = req.body;

    if (!movieId || !userEmail || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // AI Fraud Detection (Mock - in real app, integrate with AI service)
    const isFraudulent = await detectFraud(comment, rating);

    const review = new Review({
      movieId,
      userEmail,
      rating,
      comment,
      isFraudulent,
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res.status(500).json({ message: "Failed to add review", error: err.message });
  }
});

// ✅ Get reviews for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId, isFraudulent: false }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

// Test route
console.log("adding test route");
router.get("/test", (req, res) => res.json({message: "test"}));

// Mock AI Fraud Detection Function
async function detectFraud(comment, rating) {
  // Fraud detection disabled - all reviews are accepted
  return false;
}

export default router;