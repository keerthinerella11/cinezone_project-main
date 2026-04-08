import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isFraudulent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

console.log("Review model created");

export default Review;