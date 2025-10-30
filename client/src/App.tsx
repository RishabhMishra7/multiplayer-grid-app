import React, { useEffect, useState } from "react";
import { socketService } from "./services/socketService";
import PlayerCounter from "./components/PlayerCounter";
import Grid from "./components/Grid";
import CharacterModal from "./components/CharacterModal";
import HistorySlider from "./components/HistorySlider";
import { Cell, HistoryEntry, GridUpdate } from "./types";

const App: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill({ value: "", playerId: null }))
  );

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // ✅ Socket connection & listeners
  useEffect(() => {
    socketService.connect();

    socketService.on("initialGrid", (serverGrid: Cell[][]) => {
      console.log("📦 Received initial grid");
      setGrid(serverGrid);
    });

    socketService.on("gridUpdated", (newGrid: Cell[][]) => {
      console.log("📡 Grid updated:", newGrid);
      setGrid(newGrid);

      const updates: GridUpdate[] = [];
      newGrid.forEach((row, rIdx) =>
        row.forEach((cell, cIdx) => {
          if (cell.value) {
            updates.push({
              row: rIdx,
              col: cIdx,
              value: cell.value,
              playerId: cell.playerId || "",
            });
          }
        })
      );

      setHistory((prev) => [
        ...prev,
        { timestamp: Date.now(), updates, gridSnapshot: newGrid },
      ]);
    });

    return () => {
      socketService.off("gridUpdated");
      socketService.off("initialGrid");
      socketService.disconnect();
    };
  }, []);

  // 🕒 Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRestricted && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRestricted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRestricted, remainingTime]);

  // 🟩 Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (isRestricted) {
      alert(`Please wait ${remainingTime}s before updating again.`);
      return;
    }
    setSelectedCell({ row, col });
    setIsModalOpen(true);
  };

  // 🟦 Handle character submit
  const handleSubmitCharacter = (character: string) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    socketService.emit("updateCell", { row, col, value: character });

    // Start 1-minute cooldown (60 seconds)
    setIsRestricted(true);
    setRemainingTime(60);

    setIsModalOpen(false);
    setSelectedCell(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Multiplayer Grid App</h1>

      <PlayerCounter />

      <Grid grid={grid} onCellClick={handleCellClick} />

      {isModalOpen && (
        <CharacterModal
          onSubmit={handleSubmitCharacter}
          onClose={handleCloseModal}
          selectedCell={selectedCell}
        />
      )}

      {/* 🕒 Cooldown message */}
      {isRestricted && (
        <p style={{ color: "red", marginTop: "10px" }}>
          You can update again in {remainingTime}s ⏳
        </p>
      )}

      {/* 🧭 History */}
      <HistorySlider
        history={history}
        onTimeChange={(index) => {
          const entry = history[index];
          if (entry?.gridSnapshot) {
            setGrid(entry.gridSnapshot);
          }
        }}
      />
    </div>
  );
};

export default App;
