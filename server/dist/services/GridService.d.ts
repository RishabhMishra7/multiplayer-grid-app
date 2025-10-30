export interface Cell {
    value: string;
    playerId: string | null;
}
export declare class GridService {
    private grid;
    private readonly GRID_SIZE;
    constructor();
    private initializeGrid;
    getGrid(): Cell[][];
    isValidUpdate(row: number, col: number, value: string): boolean;
    updateCell(row: number, col: number, value: string, playerId: string): boolean;
    getCellValue(row: number, col: number): string;
    resetGrid(): void;
    cloneGrid(): Cell[][];
}
//# sourceMappingURL=GridService.d.ts.map