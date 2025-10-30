"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
class HistoryService {
    constructor() {
        this.GROUPING_WINDOW = 1000; // Group updates within 1 second
        this.history = [];
        this.updates = [];
    }
    addUpdate(update) {
        this.updates.push(update);
        this.groupUpdates();
    }
    groupUpdates() {
        if (this.updates.length === 0)
            return;
        const now = Date.now();
        const latestUpdate = this.updates[this.updates.length - 1];
        // Check if we should create a new history entry
        const lastEntry = this.history[this.history.length - 1];
        if (!lastEntry || now - lastEntry.timestamp > this.GROUPING_WINDOW) {
            // Create new history entry
            this.history.push({
                timestamp: latestUpdate.timestamp,
                updates: [latestUpdate],
            });
        }
        else {
            // Add to existing entry (group updates within the same second)
            lastEntry.updates.push(latestUpdate);
        }
    }
    getHistory() {
        return this.history;
    }
    getGridAtTime(targetTimestamp) {
        // Start with empty grid
        const grid = [];
        const GRID_SIZE = 10;
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                grid[i][j] = { value: "", playerId: null };
            }
        }
        // Apply all updates up to the target timestamp
        for (const entry of this.history) {
            if (entry.timestamp <= targetTimestamp) {
                for (const update of entry.updates) {
                    if (update.timestamp <= targetTimestamp) {
                        grid[update.row][update.col] = {
                            value: update.value,
                            playerId: update.playerId,
                        };
                    }
                }
            }
        }
        return grid;
    }
    getUpdateCount() {
        return this.updates.length;
    }
    getTimeRange() {
        if (this.history.length === 0) {
            return null;
        }
        return {
            start: this.history[0].timestamp,
            end: this.history[this.history.length - 1].timestamp,
        };
    }
    clearHistory() {
        this.history = [];
        this.updates = [];
    }
    // Get all updates for a specific player
    getPlayerUpdates(playerId) {
        return this.updates.filter((update) => update.playerId === playerId);
    }
    // Get the most recent updates (for display purposes)
    getRecentUpdates(limit = 10) {
        return this.updates.slice(-limit);
    }
    // Save a complete grid snapshot at a specific point
    saveGridSnapshot(grid, timestamp) {
        const entry = this.history.find((e) => e.timestamp === timestamp);
        if (entry) {
            entry.gridSnapshot = grid.map((row) => row.map((cell) => ({ ...cell })));
        }
    }
}
exports.HistoryService = HistoryService;
//# sourceMappingURL=HistoryService.js.map