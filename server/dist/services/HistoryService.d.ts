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
export declare class HistoryService {
    private history;
    private updates;
    private readonly GROUPING_WINDOW;
    constructor();
    addUpdate(update: GridUpdate): void;
    private groupUpdates;
    getHistory(): HistoryEntry[];
    getGridAtTime(targetTimestamp: number): Cell[][];
    getUpdateCount(): number;
    getTimeRange(): {
        start: number;
        end: number;
    } | null;
    clearHistory(): void;
    getPlayerUpdates(playerId: string): GridUpdate[];
    getRecentUpdates(limit?: number): GridUpdate[];
    saveGridSnapshot(grid: Cell[][], timestamp: number): void;
}
//# sourceMappingURL=HistoryService.d.ts.map