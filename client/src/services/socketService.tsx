// client/src/services/socketService.ts
import { io, Socket } from "socket.io-client";

// 👇 store the instance globally to persist across hot reloads
const globalSocket = (window as any)._globalSocket || null;

class SocketService {
  private socket: Socket | null = globalSocket;
  private hasConnected = !!globalSocket;

  connect(): void {
    if (this.hasConnected && this.socket?.connected) {
      console.log("⚙️ Already connected:", this.socket.id);
      return;
    }

    if (!this.socket) {
      this.socket = io(
        process.env.REACT_APP_SERVER_URL || "http://localhost:3001",
        {
          transports: ["websocket"],
          reconnection: true,
        }
      );
      (window as any)._globalSocket = this.socket; // 👈 persist globally
    }

    this.hasConnected = true;

    this.socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("⚠️ Connection error:", err.message);
    });
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    if (callback) this.socket.off(event, callback);
    else this.socket.off(event);
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      (window as any)._globalSocket = null;
      this.hasConnected = false;
    }
  }

  isConnected(): boolean {
    return !!(this.socket && this.socket.connected);
  }

  // ✅ Added getter method for socket ID (for grid / player tracking)
  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

export const socketService = new SocketService();
