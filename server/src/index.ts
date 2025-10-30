import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let playerCount = 0;
let grid: { value: string; playerId: string | null }[][] = Array(10)
  .fill(null)
  .map(() => Array(10).fill({ value: "", playerId: null }));

io.on("connection", (socket) => {
  playerCount++;
  console.log(`✅ Player connected: ${socket.id}`);
  io.emit("playerCount", playerCount);

  // Send the current grid to the new client
  socket.emit("initialGrid", grid);

  // Handle cell update
  socket.on("updateCell", ({ row, col, value }) => {
    if (grid[row] && grid[row][col]) {
      grid[row][col] = { value, playerId: socket.id };
      io.emit("gridUpdated", grid); // broadcast new grid to all
      console.log(`🧱 Updated cell (${row},${col}) = '${value}'`);
    }
  });

  socket.on("disconnect", () => {
    playerCount--;
    if (playerCount < 0) playerCount = 0;
    io.emit("playerCount", playerCount);
    console.log(`❌ Player disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});
