import React, { useState, useRef, useEffect } from "react";
import "../styles/CharacterModal.css";

interface CharacterModalProps {
  onSubmit: (character: string) => void;
  onClose: () => void;
  selectedCell: { row: number; col: number } | null;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  onSubmit,
  onClose,
  selectedCell,
}) => {
  const [character, setCharacter] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!character || character.trim().length === 0) {
      setError("Please enter a character");
      return;
    }

    // Submit the first character if multiple are entered
    const firstChar = character.trim().charAt(0);
    onSubmit(firstChar);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCharacter(value);
    setError("");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Common Unicode characters for quick selection
  const quickCharacters = [
    "★",
    "♥",
    "♦",
    "♣",
    "♠",
    "✓",
    "✗",
    "☺",
    "☹",
    "♪",
    "☀",
    "☁",
    "☂",
    "☃",
    "⚡",
    "❄",
    "✿",
    "❀",
    "◆",
    "●",
    "▲",
    "▼",
    "◀",
    "▶",
    "■",
    "□",
    "◯",
    "◉",
    "♂",
    "♀",
  ];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Select Character</h2>
        {selectedCell && (
          <p className="cell-info">
            Cell: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={character}
              onChange={handleInputChange}
              placeholder="Enter any Unicode character"
              maxLength={10}
              className="character-input"
            />
            {error && <span className="error">{error}</span>}
          </div>

          <div className="quick-select">
            <p>Quick Select:</p>
            <div className="character-grid">
              {quickCharacters.map((char, index) => (
                <button
                  key={index}
                  type="button"
                  className="quick-char"
                  onClick={() => {
                    setCharacter(char);
                    setError("");
                  }}
                  title={`Select ${char}`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={!character}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterModal;
