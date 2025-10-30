interface Player {
  id: string;
  cooldownEndTime: number | null;
  joinedAt: number;
}

export class PlayerService {
  private players: Map<string, Player>;
  private readonly COOLDOWN_DURATION = 60000; // 1 minute in milliseconds

  constructor() {
    this.players = new Map();
  }

  addPlayer(playerId: string): void {
    this.players.set(playerId, {
      id: playerId,
      cooldownEndTime: null,
      joinedAt: Date.now(),
    });
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);
  }

  getPlayerCount(): number {
    return this.players.size;
  }

  canPlayerUpdate(playerId: string): boolean {
    const player = this.players.get(playerId);

    if (!player) {
      return false;
    }

    // If no cooldown is set, player can update
    if (!player.cooldownEndTime) {
      return true;
    }

    // Check if cooldown has expired
    const now = Date.now();
    if (now >= player.cooldownEndTime) {
      // Reset cooldown
      player.cooldownEndTime = null;
      return true;
    }

    return false;
  }

  setPlayerCooldown(playerId: string): void {
    const player = this.players.get(playerId);

    if (player) {
      player.cooldownEndTime = Date.now() + this.COOLDOWN_DURATION;
    }
  }

  getRemainingCooldown(playerId: string): number {
    const player = this.players.get(playerId);

    if (!player || !player.cooldownEndTime) {
      return 0;
    }

    const now = Date.now();
    const remaining = player.cooldownEndTime - now;

    return remaining > 0 ? remaining : 0;
  }

  getPlayerInfo(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  resetAllCooldowns(): void {
    this.players.forEach((player) => {
      player.cooldownEndTime = null;
    });
  }
}
