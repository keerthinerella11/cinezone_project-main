// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

// ✅ Use your new TMDB API key
const API_KEY = import.meta.env.VITE_TMDB_KEY || "eeec6858ccc8ea28e5972fba3c3e55c4";

// ✅ Use backend URL from env (works for Render + local)
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://cinezone-project.onrender.com";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const user = localStorage.getItem("userEmail") || "guest";

function MovieDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(state?.movie || null);
  const [loading, setLoading] = useState(
    !state?.movie || (state?.movie?.id && !isNaN(state.movie.id) && !state.movie.runtime)
  );
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // ✅ Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/favorites/${user}`);
        const data = await res.json();
        setFavorites(data.map((fav) => fav.movieId));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  // ✅ Fetch reviews
  useEffect(() => {
    if (movie && movie.id) {
      const fetchReviews = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/reviews/${movie.id}`);
          const data = await res.json();
          setReviews(data);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };
      fetchReviews();
    }
  }, [movie]);

  // ✅ Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          userEmail: user,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
        alert("Review submitted! AI fraud detection checked.");
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong!");
    }
  };

  // ✅ Fetch full movie details when needed
  useEffect(() => {
    const shouldFetch = () => {
      if (!movie && id) return true;
      if (movie && movie.id && !isNaN(movie.id) && !movie.runtime) return true;
      return false;
    };

    if (!shouldFetch()) return;

    const fetchMovie = async () => {
      setLoading(true);
      try {
        let movieData;
        let movieId = id;

        if (movie && movie.id && !isNaN(movie.id)) {
          movieId = movie.id;
        }

        // If id is not a number, search by title
        if (isNaN(movieId)) {
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieId)}&language=en-US`
          );
          const searchData = await searchRes.json();
          if (searchData.results && searchData.results.length > 0) {
            movieId = searchData.results[0].id;
          } else {
            setError("Movie not found.");
            setLoading(false);
            return;
          }
        }

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        movieData = await res.json();
        setMovie(movieData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to fetch movie details.");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, movie]);

  // ✅ Fetch trailer when movie is available
  useEffect(() => {
    if (movie && movie.id && !isNaN(movie.id)) {
      const fetchTrailer = async () => {
        try {
          const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
          );
          const videoData = await videoRes.json();
          const trailerVideo = videoData.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailer(trailerVideo);
        } catch (err) {
          console.error("Failed to fetch trailer:", err);
        }
      };
      fetchTrailer();
    }
  }, [movie]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading movie details...</h2>;
  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  if (!movie)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Movie details not found</h2>
        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#00adb5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );

  return (
    <section className="movie-details-section">
      <div className="movie-details-card">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : movie.img
              ? movie.img
              : "https://via.placeholder.com/250x350?text=No+Image"
          }
          alt={movie.title}
          style={{ maxWidth: "250px", borderRadius: "10px", marginBottom: "20px" }}
        />

        <h2>{movie.title}</h2>
        {movie.tagline && <p><em>"{movie.tagline}"</em></p>}
        <p><strong>Synopsis:</strong> {movie.overview || movie.synopsis}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ {movie.vote_average || movie.rating || "N/A"} / 10</p>
        <p>
          <strong>Runtime:</strong> {
            movie.runtime
              ? `${movie.runtime} min`
              : movie.runningTime
              ? movie.runningTime
              : "N/A"
          }
        </p>
        <p>
          <strong>Genres:</strong> {
            movie.genres
              ? movie.genres.map((g) => g.name).join(", ")
              : movie.genre
              ? movie.genre
              : movie.genre_names
              ? movie.genre_names.join(", ")
              : "N/A"
          }
        </p>
        <p>
          <strong>Language:</strong> {
            movie.original_language
              ? movie.original_language.toUpperCase()
              : movie.language
              ? movie.language.toUpperCase()
              : "N/A"
          }
        </p>

        {trailer && (
          <div style={{ marginTop: "20px" }}>
            <h3>Trailer</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <button
          onClick={() => toggleFavorite(movie)}
          className={`like-button ${favorites.includes(movie.id) ? "liked" : ""}`}
          style={{ marginTop: "10px" }}
        >
          {favorites.includes(movie.id) ? "❤️ Liked" : "🤍 Like"}
        </button>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {showReviewForm ? "Cancel Review" : "Write a Review"}
        </button>

        {showReviewForm && (
          <form onSubmit={submitReview} style={{ marginTop: "20px" }}>
            <h3>Add Your Review</h3>
            <label>
              Rating:
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                style={{ marginLeft: "10px" }}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <textarea
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows="4"
              style={{ width: "100%", marginTop: "10px" }}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit Review
            </button>
          </form>
        )}

        <div style={{ marginTop: "30px" }}>
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>{review.userEmail}</strong> - ⭐ {review.rating}/5
                </p>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#00adb5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </section>
  );
}

export default MovieDetails;
