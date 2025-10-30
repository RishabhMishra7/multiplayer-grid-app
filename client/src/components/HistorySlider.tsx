import React, { useState, useEffect } from "react";
import { HistoryEntry } from "../types";
import "../styles/HistorySlider.css";

interface HistorySliderProps {
  history: HistoryEntry[];
  onTimeChange: (timestamp: number) => void;
  disabled?: boolean;
}

const HistorySlider: React.FC<HistorySliderProps> = ({
  history = [],
  onTimeChange,
  disabled = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep slider synced with latest history
  useEffect(() => {
    if (history.length > 0) {
      setCurrentIndex(history.length - 1);
    }
  }, [history]);

  // Auto-play animation through history
  useEffect(() => {
    if (isPlaying && currentIndex < history.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        if (history[currentIndex + 1]) {
          onTimeChange(history[currentIndex + 1].timestamp);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentIndex >= history.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentIndex, history, onTimeChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setCurrentIndex(index);
    if (history[index]) {
      onTimeChange(history[index].timestamp);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const handlePlayPause = () => {
    if (currentIndex >= history.length - 1) setCurrentIndex(0);
    setIsPlaying(!isPlaying);
  };

  const handleStepBackward = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onTimeChange(history[newIndex].timestamp);
    }
  };

  const handleStepForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onTimeChange(history[newIndex].timestamp);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (history.length > 0) {
      const lastIndex = history.length - 1;
      setCurrentIndex(lastIndex);
      onTimeChange(history[lastIndex].timestamp);
    }
  };

  // If no history yet, show placeholder
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="history-slider-container">
        <div className="no-history">No history available yet</div>
      </div>
    );
  }

  const currentEntry = history[currentIndex];
  const totalUpdates = history.reduce(
    (sum, entry) => sum + entry.updates.length,
    0
  );

  return (
    <div className="history-slider-container">
      <h3>History Timeline</h3>

      <div className="history-info">
        <span>Total Updates: {totalUpdates}</span>
        <span>Events: {history.length}</span>
      </div>

      <div className="slider-wrapper">
        <input
          type="range"
          min="0"
          max={history.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="history-slider"
          disabled={disabled || isPlaying}
        />

        <div className="slider-labels">
          <span>{history[0] && formatTimestamp(history[0].timestamp)}</span>
          <span className="current-time">
            {currentEntry && formatTimestamp(currentEntry.timestamp)}
          </span>
          <span>
            {history[history.length - 1] &&
              formatTimestamp(history[history.length - 1].timestamp)}
          </span>
        </div>
      </div>

      <div className="history-controls">
        <button
          onClick={handleStepBackward}
          disabled={disabled || currentIndex === 0 || isPlaying}
          className="control-button"
        >
          ⏮ Previous
        </button>

        <button
          onClick={handlePlayPause}
          disabled={disabled}
          className="control-button play-button"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          onClick={handleStepForward}
          disabled={
            disabled || currentIndex === history.length - 1 || isPlaying
          }
          className="control-button"
        >
          Next ⏭
        </button>

        <button
          onClick={handleReset}
          disabled={disabled}
          className="control-button reset-button"
        >
          ⏹ Latest
        </button>
      </div>

      {currentEntry && (
        <div className="current-event">
          <h4>Event Details:</h4>
          <p>{currentEntry.updates.length} update(s) at this moment</p>
          {currentEntry.updates.map((update, idx) => (
            <div key={idx} className="update-detail">
              Cell ({update.row + 1}, {update.col + 1}): "{update.value}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySlider;
