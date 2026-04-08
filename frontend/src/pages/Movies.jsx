// src/pages/Movies.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const movies = [
  {
    id: "hc1",
    title: "HIT-The Third Case",
    cast: "Nani, Srinidhi Shetty",
    genre: "Thriller",
    synopsis: "A gripping crime thriller.",
    directedBy: "Sailesh Kolanu",
    writtenBy: "Sailesh Kolanu",
    producedBy: "Prashanti Tipirneni, Nani",
    musicBy: "Mickey J. Meyer",
    runningTime: "157 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/HIT3.jpg",
  },
  {
    id: "hc2",
    title: "Jailer",
    cast: "Rajinikanth, Vinayakan, Ramya Krishnan",
    genre: "Action, Comedy",
    synopsis: "A retired jailer goes on a manhunt to find his son's killers.",
    directedBy: "Nelson Dilipkumar",
    writtenBy: "Nelson Dilipkumar",
    producedBy: "Kalanithi Maran",
    musicBy: "Anirudh Ravichander",
    runningTime: "168 minutes",
    country: "India",
    language: "Tamil",
    img: "/images/jailer.jpg",
  },
  {
    id: "hc3",
    title: "Chennai 2 Singapore",
    cast: "Rahman, Priya Bhavani Shankar",
    genre: "Comedy, Romance",
    synopsis: "A man travels from Chennai to Singapore to win back his love.",
    directedBy: " Abbas Burmawalla, Mustan Burmawalla",
    writtenBy: "Amitabh Varma",
    producedBy: "Sajid Nadiadwala",
    musicBy: "Pritam",
    runningTime: "140 minutes",
    country: "India",
    language: "Hindi",
    img: "/images/chennai.jpg",
  },
  {
    id: "hc4",
    title: "RRR",
    cast: "Ram Charan, N.T. Rama Rao Jr., Ajay Devgn",
    genre: "Action, Drama",
    synopsis: "Two revolutionaries fight against the British Empire in 1920s India.",
    directedBy: "S.S. Rajamouli",
    writtenBy: "S.S. Rajamouli",
    producedBy: "D. V. V. Danayya",
    musicBy: "M.M. Keeravani",
    runningTime: "187 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/rrr.jpg",
  },
  {
    id: "hc5",
    title: "Pushpa: The Rise",
    cast: "Allu Arjun, Rashmika Mandanna",
    genre: "Action, Crime",
    synopsis: "A smuggler rises to power in the red sandalwood business.",
    directedBy: "Sukumar",
    writtenBy: "Sukumar",
    producedBy: "Naveen Yerneni, Y. Ravi Shankar",
    musicBy: "Devi Sri Prasad",
    runningTime: "179 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/pushpa.jpg",
  },
  {
    id: "hc6",
    title: "Baahubali: The Beginning",
    cast: "Prabhas, Rana Daggubati, Anushka Shetty",
    genre: "Action, Fantasy",
    synopsis: "A warrior fights to reclaim his kingdom.",
    directedBy: "S.S. Rajamouli",
    writtenBy: "S.S. Rajamouli",
    producedBy: "Shobu Yarlagadda, Prasad Devineni",
    musicBy: "M.M. Keeravani",
    runningTime: "159 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/baahubali.jpg",
  },
  {
    title: "KGF: Chapter 1",
    cast: "Yash, Srinidhi Shetty",
    genre: "Action, Drama",
    synopsis: "A young man rises to power in the gold mines.",
    directedBy: "Prashanth Neel",
    writtenBy: "Prashanth Neel",
    producedBy: "Vijay Kiragandur",
    musicBy: "Ravi Basrur",
    runningTime: "156 minutes",
    country: "India",
    language: "Kannada",
    img: "/images/kgf.jpg",
  },
  {
    title: "Dangal",
    cast: "Aamir Khan, Sakshi Tanwar",
    genre: "Biography, Drama",
    synopsis: "A former wrestler trains his daughters to become world-class wrestlers.",
    directedBy: "Nitesh Tiwari",
    writtenBy: "Piyush Gupta, Shabaaz Abdullah",
    producedBy: "Aamir Khan, Kiran Rao",
    musicBy: "Pritam",
    runningTime: "161 minutes",
    country: "India",
    language: "Hindi",
    img: "/images/dangal.jpg",
  },
  {
    title: "Arjun Reddy",
    cast: "Vijay Deverakonda, Shalini Pandey",
    genre: "Drama, Romance",
    synopsis: "A brilliant but short-tempered medical student faces personal struggles.",
    directedBy: "Sandeep Reddy Vanga",
    writtenBy: "Sandeep Reddy Vanga",
    producedBy: "Pranay Reddy Vanga",
    musicBy: "Radhan",
    runningTime: "182 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/arjunreddy.jpg",
  },
  {
    title: "Jersey",
    cast: "Shahid Kapoor, Mrunal Thakur",
    genre: "Drama, Sport",
    synopsis: "A cricketer returns to the game after personal setbacks.",
    directedBy: "Gowtam Tinnanuri",
    writtenBy: "Gowtam Tinnanuri",
    producedBy: "Suryadevara Naga Vamsi",
    musicBy: "Anirudh Ravichander",
    runningTime: "158 minutes",
    country: "India",
    language: "Telugu",
    img: "/images/jersey.jpg",
  },
  // 👉 Add other movies here in the same format
];

function Movies() {
  const navigate = useNavigate();

  const handleClick = (movie) => {
    navigate(`/movie/${movie.title}`, { state: { movie } });
  };

  return (
    <section className="latest-section">
      <h2>All Movies</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="movie-card"
            onClick={() => handleClick(movie)}
          >
            <img src={movie.img} alt={movie.title} />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Movies;
