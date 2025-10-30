import { Cell } from "./GridService";

export interface GridUpdate {
  row: number;
  col: number;
  value: string;
  playerId: string;
  timestamp: number;
}

export interface HistoryEntry {
  timestamp: number;
  updates: GridUpdate[];
  gridSnapshot?: Cell[][];
}

export class HistoryService {
  private history: HistoryEntry[];
  private updates: GridUpdate[];
  private readonly GROUPING_WINDOW = 1000; // Group updates within 1 second

  constructor() {
    this.history = [];
    this.updates = [];
  }

  addUpdate(update: GridUpdate): void {
    this.updates.push(update);
    this.groupUpdates();
  }

  private groupUpdates(): void {
    if (this.updates.length === 0) return;

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
    } else {
      // Add to existing entry (group updates within the same second)
      lastEntry.updates.push(latestUpdate);
    }
  }

  getHistory(): HistoryEntry[] {
    return this.history;
  }

  getGridAtTime(targetTimestamp: number): Cell[][] {
    // Start with empty grid
    const grid: Cell[][] = [];
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

  getUpdateCount(): number {
    return this.updates.length;
  }

  getTimeRange(): { start: number; end: number } | null {
    if (this.history.length === 0) {
      return null;
    }

    return {
      start: this.history[0].timestamp,
      end: this.history[this.history.length - 1].timestamp,
    };
  }

  clearHistory(): void {
    this.history = [];
    this.updates = [];
  }

  // Get all updates for a specific player
  getPlayerUpdates(playerId: string): GridUpdate[] {
    return this.updates.filter((update) => update.playerId === playerId);
  }

  // Get the most recent updates (for display purposes)
  getRecentUpdates(limit: number = 10): GridUpdate[] {
    return this.updates.slice(-limit);
  }

  // Save a complete grid snapshot at a specific point
  saveGridSnapshot(grid: Cell[][], timestamp: number): void {
    const entry = this.history.find((e) => e.timestamp === timestamp);
    if (entry) {
      entry.gridSnapshot = grid.map((row) => row.map((cell) => ({ ...cell })));
    }
  }
}
