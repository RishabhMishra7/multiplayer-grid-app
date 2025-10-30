interface Player {
    id: string;
    cooldownEndTime: number | null;
    joinedAt: number;
}
export declare class PlayerService {
    private players;
    private readonly COOLDOWN_DURATION;
    constructor();
    addPlayer(playerId: string): void;
    removePlayer(playerId: string): void;
    getPlayerCount(): number;
    canPlayerUpdate(playerId: string): boolean;
    setPlayerCooldown(playerId: string): void;
    getRemainingCooldown(playerId: string): number;
    getPlayerInfo(playerId: string): Player | undefined;
    getAllPlayers(): Player[];
    resetAllCooldowns(): void;
}
export {};
//# sourceMappingURL=PlayerService.d.ts.map