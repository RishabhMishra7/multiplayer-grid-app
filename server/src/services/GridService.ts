export interface Cell {
  value: string;
  playerId: string | null;
}

export class GridService {
  private grid: Cell[][];
  private readonly GRID_SIZE = 10;

  constructor() {
    this.grid = this.initializeGrid();
  }

  private initializeGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let i = 0; i < this.GRID_SIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < this.GRID_SIZE; j++) {
        grid[i][j] = { value: "", playerId: null };
      }
    }
    return grid;
  }

  getGrid(): Cell[][] {
    return this.grid;
  }

  isValidUpdate(row: number, col: number, value: string): boolean {
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

  updateCell(
    row: number,
    col: number,
    value: string,
    playerId: string
  ): boolean {
    if (!this.isValidUpdate(row, col, value)) {
      return false;
    }

    this.grid[row][col] = {
      value: value,
      playerId: playerId,
    };

    return true;
  }

  getCellValue(row: number, col: number): string {
    if (row >= 0 && row < this.GRID_SIZE && col >= 0 && col < this.GRID_SIZE) {
      return this.grid[row][col].value;
    }
    return "";
  }

  resetGrid(): void {
    this.grid = this.initializeGrid();
  }

  // Create a deep copy of the grid
  cloneGrid(): Cell[][] {
    return this.grid.map((row) => row.map((cell) => ({ ...cell })));
  }
}
