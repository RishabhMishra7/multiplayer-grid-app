"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const GridService_1 = require("./services/GridService");
const PlayerService_1 = require("./services/PlayerService");
const HistoryService_1 = require("./services/HistoryService");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Services
const gridService = new GridService_1.GridService();
const playerService = new PlayerService_1.PlayerService();
const historyService = new HistoryService_1.HistoryService();
// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`New player connected: ${socket.id}`);
    // Add player to the service
    playerService.addPlayer(socket.id);
    // Send current grid state to the new player
    socket.emit("grid-state", {
        grid: gridService.getGrid(),
        history: historyService.getHistory(),
    });
    // Broadcast updated player count to all clients
    io.emit("player-count", playerService.getPlayerCount());
    // Handle cell update
    socket.on("update-cell", (data) => {
        const playerId = socket.id;
        // Check if player can update (cooldown check)
        if (!playerService.canPlayerUpdate(playerId)) {
            const remainingTime = playerService.getRemainingCooldown(playerId);
            socket.emit("update-error", {
                message: "You are in cooldown period",
                remainingTime,
            });
            return;
        }
        // Validate the update
        if (!gridService.isValidUpdate(data.row, data.col, data.value)) {
            socket.emit("update-error", {
                message: "Invalid update: Cell already occupied or invalid position",
            });
            return;
        }
        // Update the grid
        const success = gridService.updateCell(data.row, data.col, data.value, playerId);
        if (success) {
            // Set player cooldown
            playerService.setPlayerCooldown(playerId);
            // Add to history
            historyService.addUpdate({
                row: data.row,
                col: data.col,
                value: data.value,
                playerId,
                timestamp: Date.now(),
            });
            // Broadcast the update to all clients
            io.emit("cell-updated", {
                row: data.row,
                col: data.col,
                value: data.value,
                playerId,
            });
            // Send updated history to all clients
            io.emit("history-update", historyService.getHistory());
            // Send cooldown status to the player who made the update
            socket.emit("cooldown-started", {
                duration: 60000, // 1 minute in milliseconds
                endTime: Date.now() + 60000,
            });
        }
    });
    // Handle history request
    socket.on("get-history", () => {
        socket.emit("history-update", historyService.getHistory());
    });
    // Handle time travel request
    socket.on("time-travel", (data) => {
        const historicalGrid = historyService.getGridAtTime(data.timestamp);
        socket.emit("historical-grid", {
            grid: historicalGrid,
            timestamp: data.timestamp,
        });
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        playerService.removePlayer(socket.id);
        // Broadcast updated player count
        io.emit("player-count", playerService.getPlayerCount());
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});
//# sourceMappingURL=index.js.map