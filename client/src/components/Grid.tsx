import React from "react";
import { Cell } from "../types";
import "../styles/Grid.css";

interface GridProps {
  grid: Cell[][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, onCellClick, disabled = false }) => {
  // Ensure grid always has 10x10 structure
  const displayGrid =
    grid && grid.length > 0
      ? grid
      : Array(10)
          .fill(null)
          .map(() => Array(10).fill({ value: "", playerId: null }));

  return (
    <div className={`grid ${disabled ? "grid-disabled" : ""}`}>
      {displayGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell ${cell.value ? "occupied" : "empty"} ${
                !disabled && !cell.value ? "clickable" : ""
              }`}
              onClick={() =>
                !disabled && !cell.value && onCellClick(rowIndex, colIndex)
              }
              data-row={rowIndex}
              data-col={colIndex}
            >
              <span className="cell-value">{cell.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
