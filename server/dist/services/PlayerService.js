"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
class PlayerService {
    constructor() {
        this.COOLDOWN_DURATION = 60000; // 1 minute in milliseconds
        this.players = new Map();
    }
    addPlayer(playerId) {
        this.players.set(playerId, {
            id: playerId,
            cooldownEndTime: null,
            joinedAt: Date.now(),
        });
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
    }
    getPlayerCount() {
        return this.players.size;
    }
    canPlayerUpdate(playerId) {
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
    setPlayerCooldown(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            player.cooldownEndTime = Date.now() + this.COOLDOWN_DURATION;
        }
    }
    getRemainingCooldown(playerId) {
        const player = this.players.get(playerId);
        if (!player || !player.cooldownEndTime) {
            return 0;
        }
        const now = Date.now();
        const remaining = player.cooldownEndTime - now;
        return remaining > 0 ? remaining : 0;
    }
    getPlayerInfo(playerId) {
        return this.players.get(playerId);
    }
    getAllPlayers() {
        return Array.from(this.players.values());
    }
    resetAllCooldowns() {
        this.players.forEach((player) => {
            player.cooldownEndTime = null;
        });
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=PlayerService.js.map