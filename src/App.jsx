import { useEffect, useState } from "react";

var circleSize = '250px'
var circlePadding = '10px'
// Reusable Card Component (Perfect Circle)
function CircleCard({ title, subtitle, content, style = {} }) {
  return (
    <div style={{
      width: circleSize,
      height: circleSize,
      padding: circlePadding,
      backgroundColor: 'white',
      borderRadius: '50%',
      boxShadow: '10px 45px 50px 12px rgba(0, 0, 0, 0.25)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ...style
    }}>
      <h1 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '8px',
        margin: '0 0 8px 0',
        color: '#1f2937'
      }}>{title}</h1>
      {subtitle && <p style={{
        fontSize: '12px',
        marginBottom: '12px',
        margin: '0 0 12px 0',
        color: '#6b7280'
      }}>{subtitle}</p>}
      <p style={{
        fontSize: '24px',
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        color: '#2563eb',
        margin: 0,
        fontWeight: 'bold',
        lineHeight: '1.2'
      }}>{content}</p>
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
  // Time of First Kiss: 
  const elapsed = useElapsedTime("August 17, 2025 22:30:00 PST");

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <CircleCard
        title="Time Together"
        subtitle="Since our 🪄 moment"
        content={elapsed}
      />
    </div>
  );
}