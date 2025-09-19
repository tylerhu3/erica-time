import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pic1 from "./assets/pic1.png";
import pic2 from "./assets/pic2.png";
import pic3 from "./assets/pic3.png";
import pic4 from "./assets/pic4.png";
import pic5 from "./assets/pic5.png";
import pic6 from "./assets/pic6.png";

var circleSize = "250px";
var circlePadding = "10px";

// Reusable Card Component (Perfect Circle)
function CircleCard({ title, subtitle, content, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: circleSize,
        height: circleSize,
        padding: circlePadding,
        backgroundColor: "white",
        borderRadius: "50%",
        boxShadow: "10px 45px 50px 12px rgba(0, 0, 0, 0.25)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "8px",
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
            marginBottom: "12px",
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
          fontFamily: 'Menlo, Monaco, Consolas',
          color: "#2563eb",
          margin: 0,
          // fontWeight: "bold",
          lineHeight: "1.2",
        }}
      >
        {content}
      </p>
    </div>
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

  const pictures = [pic1, pic2, pic3, pic4, pic5, pic6];

  // 👇 multiple active pictures
  const [activePics, setActivePics] = useState([]);

  const handleCardClick = () => {
    const chosen = pictures[Math.floor(Math.random() * pictures.length)];

    const circleDiameter = parseInt(circleSize); // 250px
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

    const id = Date.now() + Math.random(); // unique id for key
    const newPic = { id, src: chosen, top, left };

    setActivePics((prev) => [...prev, newPic]);

    // remove after 3s (let AnimatePresence handle fade-out)
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

