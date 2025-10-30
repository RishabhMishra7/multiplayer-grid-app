import React, { useState, useEffect } from "react";
import "../styles/CooldownTimer.css";

interface CooldownTimerProps {
  endTime: number;
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ endTime }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setRemainingTime(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  if (remainingTime <= 0) {
    return null;
  }

  const progress = ((60000 - remainingTime) / 60000) * 100;

  return (
    <div className="cooldown-timer">
      <div className="cooldown-content">
        <span className="cooldown-text">Cooldown Active</span>
        <span className="cooldown-time">{formatTime(remainingTime)}</span>
      </div>
      <div className="cooldown-progress">
        <div
          className="cooldown-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default CooldownTimer;
