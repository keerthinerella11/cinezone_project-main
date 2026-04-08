import express from "express";
import Review from "../models/Review.js";

console.log("✅ reviewRoutes file is being loaded");
console.log("✅ Review model imported:", !!Review);

const router = express.Router();
console.log("✅ Express router created");

// ✅ Test route (MUST come before /:movieId)
router.get("/test", (req, res) => {
  console.log("✅ Test route called for /test");
  res.json({ message: "Reviews API is working! ✅" });
});

console.log("✅ Test route /test registered");

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

// ✅ Get reviews for a movie (MUST come last - catches all remaining GETs)
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    console.log(`Fetching reviews for movieId: ${movieId}`);
    const reviews = await Review.find({ movieId, isFraudulent: false }).sort({ createdAt: -1 });
    console.log(`Found ${reviews.length} reviews for movieId: ${movieId}`);
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

// Mock AI Fraud Detection Function
async function detectFraud(comment, rating) {
  // Fraud detection disabled - all reviews are accepted
  return false;
}

console.log("✅ reviewRoutes router is being exported");
export default router;