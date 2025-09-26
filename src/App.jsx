import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './App.css'
// Instead of importing one by one:
// import pic1 from "./assets/pic1.png";
// ...

// 👇 Dynamically import all images from ./assets
const pictureModules = import.meta.glob("./assets/*.{png,jpg,jpeg,gif}", { eager: true });

// Convert modules to an array of paths
const pictures = Object.values(pictureModules).map((mod) => mod.default);

// Shuffle utility
function shuffleArray(array) {
  const arr = [...array]; // Shallow copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i inclusive; Math.random() returns [0, 1), ex: .39 * (4+1) = 1.95 -> floor = 1
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements at i and j
  }
  return arr;
}

var circleSize = "250px";
var circlePadding = "10px";

// Reusable Card Component (Perfect Circle)

function CircleCard({ title, subtitle, content, style = {}, onClick }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();

    // after a delay, reset the shadow
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <motion.div
      onClick={handleClick}
      style={{
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        width: circleSize,
        height: circleSize,
        padding: circlePadding,
        backgroundColor: "white",
        borderRadius: "50%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
      animate={{
        boxShadow: isClicked
          ? "0px 0px 40px 15px rgba(0, 0, 0, 0.25)" // even shadow
          : "0px 0px 0px rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.6 }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          margin: "0 0 8px 0",
          color: "#1f2937",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "18px",
            margin: "0 0 12px 0",
            color: "#6b7280",
          }}
        >
          {subtitle}
        </p>
      )}
      <p
        style={{
          fontSize: "20px",
          color: "#2563eb",
          margin: 0,
          lineHeight: "1.2",
        }}
      >
        {content}
      </p>
    </motion.div>
  );
}



// Custom hook for elapsed time calculation
function useElapsedTime(targetDate) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const target = new Date(targetDate);

    const updateElapsed = () => {
      const now = new Date();
      const diffMs = now - target;

      if (diffMs < 0) {
        setElapsed("Time has not started yet");
        return;
      }

      const diffSec = Math.floor(diffMs / 1000);
      const days = Math.floor(diffSec / (3600 * 24));
      const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      setElapsed(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateElapsed(); // run once immediately
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return elapsed;
}

export default function App() {
  const elapsed = useElapsedTime("August 17, 2025 22:30:00 PST");

  // shuffle once at mount
  const [shuffledPics] = useState(() => shuffleArray(pictures));

  const [activePics, setActivePics] = useState([])

  // const pictures = [pic1, pic2, pic3, pic4, pic5, pic6];

  // 👇 multiple active pictures
  // const [activePics, setActivePics] = useState([]);

  const handleCardClick = () => {
    const chosen = shuffledPics[Math.floor(Math.random() * shuffledPics.length)];

    const circleDiameter = parseInt(circleSize);
    const imgSize = 150;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const circleCenterX = viewportW / 2;
    const circleCenterY = viewportH / 2;
    const circleRadius = circleDiameter / 2 + imgSize / 2 + 20;

    let top, left;
    do {
      top = Math.random() * (viewportH - imgSize);
      left = Math.random() * (viewportW - imgSize);
      const dx = left + imgSize / 2 - circleCenterX;
      const dy = top + imgSize / 2 - circleCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > circleRadius) break;
    } while (true);

    const id = Date.now() + Math.random();
    const newPic = { id, src: chosen, top, left };

    setActivePics((prev) => [...prev, newPic]);

    setTimeout(() => {
      setActivePics((prev) => prev.filter((p) => p.id !== id));
    }, 2500);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <CircleCard
        title="Time Together"
        subtitle="Since our first 👩🏻‍❤️‍💋‍👨🏻"
        content={elapsed}
        onClick={handleCardClick}
      />

      {/* Animate multiple pictures independently */}
      <AnimatePresence>
        {activePics.map((pic) => (
          <motion.img
            key={pic.id}
            src={pic.src}
            alt="Random"
            style={{
              position: "absolute",
              top: pic.top,
              left: pic.left,
              width: "150px",    // fixed width
              height: "auto",    // keep aspect ratio
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

