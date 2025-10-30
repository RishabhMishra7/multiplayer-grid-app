export interface Cell {
  value: string;
  playerId: string | null;
}

export interface GridUpdate {
  row: number;
  col: number;
  value: string;
  playerId: string;
}

export interface HistoryEntry {
  timestamp: number;
  updates: GridUpdate[];
  gridSnapshot?: Cell[][];
}

export interface Player {
  id: string;
  cooldownEndTime: number | null;
  joinedAt: number;
}
