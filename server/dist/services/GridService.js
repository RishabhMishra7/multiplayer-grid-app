"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridService = void 0;
class GridService {
    constructor() {
        this.GRID_SIZE = 10;
        this.grid = this.initializeGrid();
    }
    initializeGrid() {
        const grid = [];
        for (let i = 0; i < this.GRID_SIZE; i++) {
            grid[i] = [];
            for (let j = 0; j < this.GRID_SIZE; j++) {
                grid[i][j] = { value: "", playerId: null };
            }
        }
        return grid;
    }
    getGrid() {
        return this.grid;
    }
    isValidUpdate(row, col, value) {
        // Check if position is within bounds
        if (row < 0 || row >= this.GRID_SIZE || col < 0 || col >= this.GRID_SIZE) {
            return false;
        }
        // Check if cell is already occupied
        if (this.grid[row][col].value !== "") {
            return false;
        }
        // Check if value is a valid Unicode character (not empty)
        if (!value || value.length === 0) {
            return false;
        }
        return true;
    }
    updateCell(row, col, value, playerId) {
        if (!this.isValidUpdate(row, col, value)) {
            return false;
        }
        this.grid[row][col] = {
            value: value,
            playerId: playerId,
        };
        return true;
    }
    getCellValue(row, col) {
        if (row >= 0 && row < this.GRID_SIZE && col >= 0 && col < this.GRID_SIZE) {
            return this.grid[row][col].value;
        }
        return "";
    }
    resetGrid() {
        this.grid = this.initializeGrid();
    }
    // Create a deep copy of the grid
    cloneGrid() {
        return this.grid.map((row) => row.map((cell) => ({ ...cell })));
    }
}
exports.GridService = GridService;
//# sourceMappingURL=GridService.js.map